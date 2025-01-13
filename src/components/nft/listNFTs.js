import { useState, useEffect } from "react";
import { Grid, Stack, Box } from "@mui/material";
import InfiniteScroll from "react-infinite-scroller";
import CircularProgress from "@mui/material/CircularProgress";
import defaultThumb from "../../assets/images/standard.png";

import GET_TOKENS_QUERY from "../../services/nfts.js";

import Filter from "./filter/filter";
import Item from "./item/item";

import "./listNFTs.scss";
import { useQuery } from "@apollo/client";

const ListNFTs = (props) => {
  const { activeDistrict, activeSection, activeArea, activeSector, setDataNFT, setOpenModal, handleBackView } = props;

  const [idNFT, setIdNFT] = useState(null);
  const [listNFT, setListNFT] = useState([]);

  // filters ---
  //const [rarityFilter, setRarityFilter] = useState(null);
  const [sortFilter, setSortFilter] = useState("price");
  const [orderFilter, setOrderFilter] = useState("desc");

  // InfiniteScroll list ---
  const [clearTokens, setClearTokens] = useState(false);
  const [fetching, setFetching] = useState(null);
  const [next, setNext] = useState(null);
  const hasMoreItems = !!next;

  // get data ---
  const { data, loading } = useQuery(GET_TOKENS_QUERY, {
    variables: {
      filter: {
        district: activeDistrict?.code,
        section: activeSection?.code,
        area: activeArea?.code,
        sector: activeSector?.code,
        sort: sortFilter,
        order: orderFilter,
        next: !clearTokens ? next : null,
      },
    },
    skip: !fetching,
  });

  useEffect(() => {
    if (!data || loading) return;

    const { tokens: response } = data;
    setListNFT(() => (clearTokens ? response.tokens : [...listNFT, ...response.tokens]));
    setNext(() => (response.cursor ? response.cursor : null));
    setFetching(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  const handleChange = (value) => {
    switch (value) {
      case "LOWPRICE":
        setSortFilter("price");
        setOrderFilter("desc");
        break;
      case "MAXPRICE":
        setSortFilter("price");
        setOrderFilter("asc");
        break;
      case "LOWAVAILABILITY":
        setSortFilter("availability");
        setOrderFilter("desc");
        break;
      case "MAXAVAILABILITY":
        setSortFilter("availability");
        setOrderFilter("asc");
        break;
      default:
        break;
    }
  };

  const handleChangeItem = (item) => {
    if (activeArea?.open && !activeArea?.sold) {
      setIdNFT(item.token_id);
      setDataNFT(item);
      setOpenModal(true);
    }
  };

  const fetchItems = async (clearTokens = true) => {
    if (loading) return;
    if (!activeArea?.code || !activeSection?.code) return;
    
    if (clearTokens) {
      document.querySelector(".items-container").scrollTop = 0;
      setFetching(true);
    } 
    
    if (!clearTokens && next) setFetching(true);
    
    setClearTokens(clearTokens);
  };

  // onChange area or section ---
  useEffect(() => {
    setIdNFT(null);
    setOpenModal(false);
    fetchItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, activeArea, activeSector]);

  // onChange filters ---
  useEffect(() => {
    if (orderFilter || sortFilter) {
      setIdNFT(null);
      setOpenModal(false);
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderFilter, sortFilter]);


  const loader = (
    <Box key={1}>
      <CircularProgress />
    </Box>
  );

  return (
    <Grid container className="seats-container">
      <span className={`for-sale hidden-mobile ${activeSector?.open && activeSector?.purchased_nfts === activeSector?.nfts && "sold"}`}>
        {activeSector?.open && activeSector?.purchased_nfts === activeSector?.nfts ? "Sold" : "For sale"}
      </span>

      <div className="fit-section">
        <Grid container item xs={12} justifyContent="space-between" alignItems="start">
          <button onClick={handleBackView} className="button-back show-mobile">
            Back &#9650;
          </button>
        </Grid>

        <Grid item container justifyContent="center" my={2} className="hidden-mobile">
          <Grid item className="card-detail-area">
            <img
              src={activeArea?.thumbnail || defaultThumb}
              alt="stadium"
              className={`stadium-min ${!activeSector?.open || activeSector?.purchased_nfts === activeSector?.nfts ? "grey-filter" : ""}`}
              onError={(evt) => (evt.target.src = defaultThumb)}
            />
            <h4 className={activeArea?.code}>{activeArea?.name}</h4>
          </Grid>
        </Grid>

        <Grid item container>
          <Filter handleChange={handleChange} />
        </Grid>

        <Grid item container xs={12}>
          {false && (
            <Stack
              className={`cards-container ${
                !activeSector?.open || activeSector?.purchased_nfts === activeSector?.nfts ? "grey-filter" : ""
              }`}
              direction="row"
            ></Stack>
          )}
        </Grid>
      </div>

      <div className="strech-section">
        <div className={`items-container`}>
          {loading && clearTokens ? (
            <CircularProgress />
          ) : (
            <InfiniteScroll loadMore={() => fetchItems(false)} hasMore={hasMoreItems} useWindow={false} initialLoad={false} loader={loader}>
              {listNFT?.length > 0 ? (
                listNFT.map((item, pos) => (
                  <Item
                    key={pos}
                    item={item}
                    disabled={item.purchased}
                    active={idNFT === item.token_id ? "item-active" : ""}
                    color={activeArea?.color}
                    handleChange={handleChangeItem}
                  />
                ))
              ) : (
                <span style={{ color: "white" }}>no data result</span>
              )}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </Grid>
  );
};

export default ListNFTs;
