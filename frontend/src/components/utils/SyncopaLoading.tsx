import LogoImg from "../../assets/imgs/logo.png";

const SyncopaLoader: Component = () => {
  return (
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <img
        src={LogoImg}
        alt="Loading..."
        class="w-24 h-24 animate-spin"
      />
    </div>
  );
}
export default SyncopaLoader