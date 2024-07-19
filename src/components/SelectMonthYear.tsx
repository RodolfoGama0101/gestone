import { IonDatetime, IonSelect, IonSelectOption } from "@ionic/react";
import "./SelectMonthYear.css";

const SelectMonthYear: React.FC = () => {
    return (
        // <IonDatetime color={'dark'} class="select-month-year" presentation="month-year"></IonDatetime>

        <IonSelect interface="popover" label="Selecione o mês" fill="solid">
            <IonSelectOption value="01">Janeiro</IonSelectOption>
            <IonSelectOption value="02">Fevereiro</IonSelectOption>
            <IonSelectOption value="03">Março</IonSelectOption>
            <IonSelectOption value="04">Abril</IonSelectOption>
            <IonSelectOption value="05">Maio</IonSelectOption>
            <IonSelectOption value="06">Junho</IonSelectOption>
            <IonSelectOption value="07">Julho</IonSelectOption>
            <IonSelectOption value="08">Agosto</IonSelectOption>
            <IonSelectOption value="09">Setembro</IonSelectOption>
            <IonSelectOption value="10">Outubro</IonSelectOption>
            <IonSelectOption value="11">Novembro</IonSelectOption>
            <IonSelectOption value="12">Dezembro</IonSelectOption>
        </IonSelect>
    )
}

export default SelectMonthYear;