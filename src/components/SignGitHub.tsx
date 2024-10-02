import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { IonButton, IonIcon } from "@ionic/react";
import { logoGithub,} from "ionicons/icons";
import "./SignGoogle.css"

const SignGitHub: React.FC = () => {
    return(
        <IonButton color={'success'} className="ion-margin-top" ><IonIcon slot="icon-only" icon={logoGithub} className="google-logo" /></IonButton>
    );
}

export default SignGitHub