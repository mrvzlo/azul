import Pickup from "../../components/pickup";

export interface BaseAi {
  makeMove: () => Pickup;
}
