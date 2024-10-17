import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { IonButton, IonIcon } from "@ionic/react";
import { logoGithub, } from "ionicons/icons";
import "./SignGoogle.css"

const SignGitHub: React.FC = () => {
    async function signGithub() {
        const provider = new GithubAuthProvider();

        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);

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
                const credential = GithubAuthProvider.credentialFromError(error);

                window.alert(errorMessage);
            });
    }

    return (
        <IonButton color={'success'} className="ion-margin-top" onClick={signGithub}><IonIcon slot="icon-only" icon={logoGithub} className="google-logo" /></IonButton>
    );
}

export default SignGitHub