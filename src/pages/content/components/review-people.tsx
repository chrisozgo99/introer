import { statusUpdate } from "@src/state/actions/status";
import { User, UserInfo, UserSearchResult } from "@src/types/user";
import { useDispatch } from "react-redux";

interface ReviewPeopleProps {
  query1Results: UserSearchResult;
  query2Results: UserSearchResult;
}

export default function ReviewPeople(props: ReviewPeopleProps) {
  const dispatch = useDispatch();
  const { query1Results, query2Results } = props;

  let query1: React.ReactNode, query2: React.ReactNode;

  const displayedUser = (user: User | UserInfo) => {
    return (
      <div className="w-full flex flex-row">
        <div className="w-1/2">
          <img src={user.profilePhoto} alt="profile picture" />
        </div>
        <div className="w-1/2">
          <div>{user.name}</div>
          <div>{user.title}</div>
        </div>
      </div>
    );
  };

  if (Array.isArray(query1Results)) {
    query1 = query1Results.map((result: User | UserInfo) => {
      return displayedUser(result);
    });
  } else {
    query1 = displayedUser(query1Results);
  }

  if (Array.isArray(query2Results)) {
    query2 = query2Results.map((result: User | UserInfo) => {
      return displayedUser(result);
    });
  } else {
    query2 = displayedUser(query2Results);
  }

  return (
    <div>
      <div className="w-full flex flex-row">
        <div className="w-1/2">{query1}</div>
        <div className="w-1/2">{query2}</div>
      </div>
      <div>
        <div>Does this look right?</div>
        <div className="flex flex-row">
          <div>
            <button>Yes</button>
          </div>
          <div>
            <button
              onClick={() => {
                dispatch(
                  statusUpdate({
                    type: "STATUS_UPDATE",
                    status: "choosePeople",
                  })
                );
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
