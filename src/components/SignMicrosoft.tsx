import { IonButton, IonIcon } from "@ionic/react";
import {logoMicrosoft,} from "ionicons/icons";
import "./SignGoogle.css"

const SignMicrosoft: React.FC = () => {
    return(
        <IonButton color={'success'} className="ion-margin-top" shape="round"><IonIcon slot="icon-only" icon={logoMicrosoft} className="google-logo" /></IonButton>
    );
}

export default SignMicrosoft