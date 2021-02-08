import React, { useEffect, useState } from "react";

import { ImageInput, ImageField } from "react-admin";

const ImageSubmit = (props) => {
  const [loaded, setLoaded] = useState(false);

  //   useEffect(() => {
  //     console.log(props.imageURL);
  //   }, []);

  return (
    <React.Fragment>
      {!props.imageURL && (
        <ImageInput
          multiple={false}
          source="logo"
          label="Logo"
          accept="image/*"
        >
          <ImageField source="url" title="logo" />
        </ImageInput>
      )}
      {props.imageURL && (
        <div style={{ visibility: loaded ? "visible" : "hidden" }}>
          {loaded && (
            <ImageInput
              multiple={false}
              source="logo"
              label="Logo"
              accept="image/*"
            />
          )}
          <img
            src={props.imageURL}
            title="name"
            onLoad={() => {
              setLoaded(true);
            }}
          />
        </div>
      )}
      {!loaded && <h1>Loading</h1>}
    </React.Fragment>
  );
};

export default ImageSubmit;
