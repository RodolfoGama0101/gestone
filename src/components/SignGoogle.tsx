import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { IonButton, IonIcon } from "@ionic/react";
import { logoGoogle } from "ionicons/icons";
import "./SignGoogle.css"

const SignGoogle: React.FC = () => {

    async function googleLogin() {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;

                const refDoc = doc(db, "MesSelecao", user.uid);
                await setDoc(refDoc, {
                    uid: user.uid,
                    mes: new Date().getMonth()
                });

                if (user) {
                    window.location.href = '/home';
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    return (
        <IonButton color={'success'} className="ion-margin-top" shape="round" onClick={(googleLogin)}><IonIcon slot="icon-only" icon={logoGoogle} className="google-logo" /></IonButton>
    );
}

export default SignGoogle; 