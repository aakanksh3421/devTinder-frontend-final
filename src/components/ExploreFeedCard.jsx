import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const ExploreFeedCard = ({ user, status  }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div
      className="card w-96 shadow-xl h-[500px] flex flex-col 
        bg-base-300"
    >
      <figure className="flex justify-center items-center bg-base-200 h-56">
        <img
          src={photoUrl}
          alt="photo"
          className="h-full w-auto object-contain rounded-md"
        />
      </figure>

      <div className="card-body flex flex-col justify-between flex-grow">
        <div>
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <p className="min-h-[1.5rem]">{age && gender ? `${age}, ${gender}` : <span>&nbsp;</span>}</p>
          <p className="min-h-[4rem]">{about || <span>&nbsp;</span>}</p>
          <label className="block mt-2">Skills:</label>
          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {skills && skills.length > 0 ? (
              skills.map((s, index) => (
                <div key={index} className="badge badge-ghost">
                  {s}
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-400">No skills listed</span>
            )}
          </div>
        </div>

        <div className="card-actions justify-center mt-4">
          {status === "connected" ? (
            <div className="btn btn-success cursor-default pointer-events-none">Connected</div>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={() => handleSendRequest("ignored", _id)}
              >
                Ignore
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleSendRequest("interested", _id)}
              >
                Interested
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreFeedCard;
