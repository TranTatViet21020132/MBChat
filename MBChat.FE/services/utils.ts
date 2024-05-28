export const defaultImageURL =
    "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

export const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    let initials;
    if (nameParts.length > 1) {
        initials =
            nameParts[0].charAt(0).toUpperCase() +
            nameParts[1].charAt(0).toUpperCase();
    } else {
        initials = nameParts[0].charAt(0).toUpperCase();
    }
    return initials;
};

export const getRandomBackgroundColor = () => {
    const getRandomValue = () => Math.floor(Math.random() * 256);
    const r = getRandomValue();
    const g = getRandomValue();
    const b = getRandomValue();
    return `rgb(${r}, ${g}, ${b})`;
  };