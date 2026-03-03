import { useParams } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import SyncopaUpperControlPanel from "../components/SyncopaApp/SyncopaUpperControlPanel";
import SyncopaLowerControlPanel from "../components/SyncopaApp/SyncopaLowerControlPanel";
import SyncopaMain from "../components/SyncopaApp/SyncopaMain";

const SyncopaApp: Component = () => {
  onMount(() => {
    const { uuid } = useParams();

    console.log(uuid);
  });

  return (
    <div class="flex flex-col h-screen">
      <SyncopaUpperControlPanel />
      <SyncopaMain />
      <SyncopaLowerControlPanel />
    </div>
  );
};

export default SyncopaApp;
