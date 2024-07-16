import Styles from "./DashCard.module.css";

const DashCard = ({ icon: Icon, title, number }) => {
  return (
    <div className={Styles.card}>
      <div className={Styles.left}>
        <p className={Styles.title}>{title}</p>
        <p className={Styles.number}>{parseInt(number)}</p>
      </div>
      <span className={Styles.icon}>
        <Icon />
      </span>
    </div>
  );
};

export default DashCard;
