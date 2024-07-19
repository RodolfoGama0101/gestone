import { IonDatetime, IonSelect, IonSelectOption } from "@ionic/react";
import "./SelectMonthYear.css";

const SelectMonthYear: React.FC = () => {
    return (
        <IonDatetime class="select-month-year" presentation="month-year"></IonDatetime>

        
    )
}

export default SelectMonthYear;