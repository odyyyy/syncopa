import { useParams } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import UpperControlPanel from "../components/SyncopaApp/UpperControlPanel";
import LowerControlPanel from "../components/SyncopaApp/LowerControlPanel";
import SyncopaMain from "../components/SyncopaApp/SyncopaMain";

const SyncopaApp: Component = () => {
  onMount(() => {
    const { uuid } = useParams();

    console.log(uuid);
  });

  return (
    <div class="flex flex-col h-screen">
      <UpperControlPanel />
      <SyncopaMain />
      <LowerControlPanel />
    </div>
  );
};

export default SyncopaApp;
