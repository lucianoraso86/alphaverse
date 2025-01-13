import { gql } from "@apollo/client";

const POST_PLOT = gql`
  mutation UpdatePlotStatus ($input: [updatePlotStatusInput]) {
    updatePlotStatus(input: $input) {
      key
      sold
      open
    }
  }
`;

export { POST_PLOT };
