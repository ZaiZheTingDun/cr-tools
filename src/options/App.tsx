import React, { useEffect, useId, useState } from 'react';
import { Button, Input, Label, makeStyles, shorthands } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    // Stack the label above the field
    display: "flex",
    flexDirection: "column",
    // Use 2px gap below the label (per the design system)
    ...shorthands.gap("2px"),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "400px",
  },
});

const renderItem = (labelName: string, value, setValue: (value: string) => void) => {
  const id = useId();

  return (<>
    <Label htmlFor={ id }>{ labelName }</Label>
    <Input id={ id } value={ value } onChange={ (_, data) => setValue(data.value) }/>
  </>);
}

export const App = () => {
  const [teamLabel, setTeamLabel] = useState("");
  const [needReviewLabel, setNeedReviewLabel] = useState("");
  const [needFixLabel, setNeedFixLabel] = useState("");
  const [pat, setPat] = useState("");
  const [username, setUsername] = useState("");
  const styles = useStyles();

  useEffect(() => {
    chrome.storage.local.get((configuration) => {
      setTeamLabel(configuration.teamLabel);
      setNeedReviewLabel(configuration.needReviewLabel);
      setNeedFixLabel(configuration.needFixLabel);
      setPat(configuration.pat);
      setUsername(configuration.username);
    });
  }, []);

  const onSave = async () => {
    const configuration = {
      teamLabel,
      needReviewLabel,
      needFixLabel,
      pat,
      username
    };
    await chrome.storage.local.set(configuration);
    alert("Configuration save successfully!");
  };

  return (
    <div className={ styles.root }>

      { renderItem("Team Label", teamLabel, setTeamLabel) }
      { renderItem("Need Review Label", needReviewLabel, setNeedReviewLabel) }
      { renderItem("Need Fix Label", needFixLabel, setNeedFixLabel) }
      { renderItem("PAT", pat, setPat) }
      { renderItem("Username", username, setUsername) }

      <Button onClick={ onSave }>Save</Button>
    </div>
  );
};

export default App;
