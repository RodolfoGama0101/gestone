import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { IonButton, IonIcon, IonText } from "@ionic/react";
import { logoGoogle } from "ionicons/icons";
import "./SignGoogle.css"

const SignGoogle: React.FC = () => {
    async function googleLogin() {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;

                const refDocTags = doc(db, "TagsDespesas", user.uid);
                const docSnapTags = await getDoc(refDocTags);

                if (!docSnapTags.exists()) {
                    // Armazena as tags primárias de despesas
                    await setDoc(refDocTags, {
                        tags: [
                            "Roupas",
                            "Educação",
                            "Eletrônicos",
                            "Saúde",
                            "Casa",
                            "Lazer",
                            "Restaurante",
                            "Mercado",
                            "Serviços",
                            "Transporte",
                            "Viagem",
                            "Outros"
                        ]
                    });
                    console.log("Tags armazenadas com sucesso!");
                }

                const refDoc = doc(db, "MesSelecao", user.uid);
                const docSnap = await getDoc(refDoc);

                if (!docSnap.exists()) {
                    await setDoc(refDoc, {
                        uid: user.uid,
                        mes: new Date().getMonth()
                    });
                }

                if (user) {
                    window.location.href = '/home';
                }

                window.location.href = "/home";
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    return (
        <IonButton color={'success'} className="ion-margin-top" onClick={(googleLogin)} expand='block'>
            <IonIcon slot="icon-only" icon={logoGoogle} className="google-logo" />
            <IonText className="ion-text-capitalize">
                <p>Sign in with Google</p>
            </IonText>
        </IonButton>
    );
}

export default SignGoogle; 