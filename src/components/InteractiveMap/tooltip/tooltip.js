import MouseTooltip from "react-sticky-mouse-tooltip";

import "./tooltip.scss";

const Tooltip = ({ data }) => {
  if (!data?.sector) return;

  return (
    <MouseTooltip
      visible={data?.visible}
      offsetX={-60}
      offsetY={-60}
      className={`tooltip-container 
        ${!data.sector.open ? "coming-soon" : ""}
        ${data.sector.nfts === data.sector.purchased_nfts ? "sold" : ""}
        `}
    >
      {(() => {
        if (!data.sector.open) {
          return <span>COMING SOON</span>;
        } else if (data.sector.nfts === data.sector.purchased_nfts) {
          return (
            <>
              <span>SECTOR&nbsp;</span>
              <span>{data.sector.code}&nbsp;</span>
              <span className="tooltip-sold">SOLD</span>
            </>
          );
        } else {
          return (
            <>
              <span>SECTOR&nbsp;</span>
              <span className="tooltip-number">{data.sector.code}</span>
            </>
          );
        }
      })()}
    </MouseTooltip>
  );
};

export default Tooltip;
