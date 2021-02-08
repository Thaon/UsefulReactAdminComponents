import * as React from "react";
import { useCallback } from "react";
import { SaveButton, useCreate, useRedirect, useNotify } from "react-admin";

import ops from "../operations";

const CustomSaveButton = (props) => {
  React.useEffect(() => {
    async function SetCompany() {
      ops.currentCompany = await ops.getCompanyInfo();
    }

    if (!ops.currentCompany) SetCompany();
  }, []);

  const [create] = useCreate("projects");
  const notify = useNotify();
  const handleSave = (values) => {
    let data = values.data;
    let newVals = props.values;

    console.log(data, newVals);

    data = Object.assign(data, newVals);
    create(
      {
        payload: {
          data,
        },
      },
      {
        onSuccess: ({ data: newRecord }) => {
          notify("ra.notification.created", "info", {
            smart_count: 1,
          });
        },
      }
    );
  };

  // set onSave props instead of handleSubmitWithRedirect
  return (
    <SaveButton {...props} onSuccess={handleSave} redirect={props.redirect} />
  );
};

export default CustomSaveButton;
