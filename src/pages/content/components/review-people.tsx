import { statusUpdate } from "@src/state/actions/status";
import { RootState } from "@src/state/reducers";
import { User, UserInfo, UserSearchResult } from "@src/types/user";
import { generateEmailHTML } from "@src/utils/email";
import { defaultProfilePhoto } from "@src/utils/images";
import { useState } from "react";
import { useDispatch, useStore } from "react-redux";

interface ReviewPeopleProps {
  query1Results: UserSearchResult;
  query2Results: UserSearchResult;
}

export default function ReviewPeople(props: ReviewPeopleProps) {
  const dispatch = useDispatch();
  const store = useStore<RootState>();

  const { query1Results, query2Results } = props;

  const [query1SelectedInt, setQuery1SelectedInt] = useState<
    number | undefined
  >(0);
  const [query2SelectedInt, setQuery2SelectedInt] = useState<
    number | undefined
  >(0);

  let query1: React.ReactNode, query2: React.ReactNode;

  const displayedUser = (
    user: User | UserInfo,
    selected?: boolean,
    onClick?: () => void
  ) => {
    return (
      <div
        onClick={onClick}
        className={`w-full flex flex-row justify-between items-center ${
          selected && "bg-primary"
        } hover:cursor-pointer`}
      >
        <div>
          <img
            className="w-8 h-8 rounded-full"
            src={user.profilePhoto || defaultProfilePhoto}
            alt="profile picture"
          />
        </div>
        <div>
          <div className="text-xs">{user?.name}</div>
          <div className="text-xs">{user.title}</div>
        </div>
      </div>
    );
  };

  if (Array.isArray(query1Results)) {
    query1 = query1Results.map((result: User | UserInfo, index: number) => {
      return displayedUser(result, index === query1SelectedInt, () =>
        query1SelectedInt === index
          ? setQuery1SelectedInt(undefined)
          : setQuery1SelectedInt(index)
      );
    });
  } else {
    query1 = displayedUser(query1Results, true, () =>
      query1SelectedInt === 0
        ? setQuery1SelectedInt(undefined)
        : setQuery1SelectedInt(0)
    );
  }

  if (Array.isArray(query2Results)) {
    query2 = query2Results.map((result: User | UserInfo, index: number) => {
      return displayedUser(result, index === query2SelectedInt, () =>
        query2SelectedInt === index
          ? setQuery2SelectedInt(undefined)
          : setQuery2SelectedInt(index)
      );
    });
  } else {
    query2 = displayedUser(query2Results, true, () =>
      query2SelectedInt === 0
        ? setQuery2SelectedInt(undefined)
        : setQuery2SelectedInt(0)
    );
  }

  return (
    <div className="w-96 h-44 overflow-y-scroll">
      <div>
        <div className="text-center">{`Here's what we found for`}</div>
        <div className="flex flex-row">
          <div className="w-1/2 text-center">
            {`${
              Array.isArray(query1Results)
                ? query1Results[0]?.name
                : query1Results?.name
            }`}
          </div>
          <div className="w-1/2 text-center">
            {`${
              Array.isArray(query2Results)
                ? query2Results[0]?.name
                : query2Results?.name
            }`}
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between">
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
              Back
            </button>
            <div>
              <button
                onClick={() => {
                  generateEmailHTML(
                    Array.isArray(query1Results)
                      ? query1Results[query1SelectedInt || 0]
                      : query1Results,
                    Array.isArray(query2Results)
                      ? query2Results[query2SelectedInt || 0]
                      : query2Results,
                    store.getState().account.user?.name
                      ? store.getState().account.user.name
                      : ""
                  );
                  dispatch(
                    statusUpdate({
                      type: "STATUS_UPDATE",
                      status: "makeIntro",
                      hidden: true,
                    })
                  );
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row">
        <div className="w-1/2">{query1}</div>
        <div className="w-1/2">{query2}</div>
      </div>
    </div>
  );
}
