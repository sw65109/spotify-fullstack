import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

const ListAlbum = () => {
  const { api } = useAuth();
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      const response = await api.get("/api/album/list");
      if (response.data.success) setData(response.data.albums);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error occurred");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await api.post("/api/album/remove", { id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      } else {
        toast.error(response.data.message || "Remove failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error occurred");
    }
  };

  useEffect(() => {
    fetchAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>All Albums</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Color</b>
          <b>Action</b>
        </div>

        {data.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
          >
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.desc}</p>
            <input type="color" value={item.bgColor} readOnly />
            <p className="cursor-pointer" onClick={() => removeAlbum(item._id)}>
              x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAlbum;