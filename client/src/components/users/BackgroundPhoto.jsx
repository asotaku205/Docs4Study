
const BackgroundPhoto = ({ image }) => {
  return (
    <div className="relative overflow-hidden h-96 lg:h-[500px]">
      <img
        src={image}
        alt="Blog Detail"
        className="w-full  h-full object-cover"
      ></img>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent "></div>
    </div>
  );
};
export default BackgroundPhoto;