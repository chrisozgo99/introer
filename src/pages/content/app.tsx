import { useEffect, useState } from "react";
import EnterNames from "./components/enter-names";
import LogIn from "./components/log-in";
import { MakeIntro } from "./components/make-intro";
import { connect } from "react-redux";
import { RootState } from "@src/state/reducers";
import ReviewPeople from "./components/review-people";

function App(props: RootState) {
  const [component, setComponent] = useState<JSX.Element>(<MakeIntro />);

  const { account, status } = props;
  const { user } = account;

  console.log(status);

  useEffect(() => {
    if (status.status === "makeIntro") {
      setComponent(<MakeIntro />);
    } else if (status.status === "choosePeople") {
      setComponent(<EnterNames />);
    } else if (status.status === "reviewPeople") {
      setComponent(
        <ReviewPeople
          query1Results={status.searchResults.user1}
          query2Results={status.searchResults.user2}
        />
      );
    }
  }, [status.status]);

  if (!user) {
    return <LogIn />;
  }

  if (status.loading === true) {
    return <div>Loading...</div>;
  }

  return component;
}

const mapStateToProps = (state: RootState) => {
  return {
    account: state.account,
    status: state.status,
  };
};

export default connect(mapStateToProps)(App);
