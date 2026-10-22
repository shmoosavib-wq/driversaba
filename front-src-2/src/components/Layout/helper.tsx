export const Icon1 = ({ color }) => {
  const isActive = color === "#000000";

  return (
    <div id="load-state">
      {isActive ? (
        <img src="/images/layoutIcons/box-fill.svg" alt="1" />
      ) : (
        <img src="/images/layoutIcons/box-empty.svg" alt="2" />
      )}
    </div>
  );
};

export const Icon2 = ({ color }) => {
  const isActive = color === "#000000";

  return (
    <div>
      {isActive ? (
        <img src="/images/layoutIcons/note-fill.svg" alt="3" />
      ) : (
        <img src="/images/layoutIcons/note-empty.svg" alt="4" />
      )}
    </div>
  );
};

export const Icon3 = ({ color }) => {
  const isActive = color === "#000000";

  return (
    <div id="profile">
      {isActive ? (
        <img src="/images/layoutIcons/frame-fill.svg" alt="5" />
      ) : (
        <img src="/images/layoutIcons/frame-empty.svg" alt="6" />
      )}
    </div>
  );
};
