import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  inverted?: boolean;
  content?: string;
}
export default function LoadingComponent({
  inverted,
  content = "Loading...",
}: Props) {
  return (
    <Dimmer active={true} inverted>
      <Loader content={content} />
    </Dimmer>
  );
}
