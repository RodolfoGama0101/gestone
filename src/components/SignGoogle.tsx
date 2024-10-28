import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { IonButton, IonIcon, IonText } from "@ionic/react";
import { logoGoogle } from "ionicons/icons";
import "./css/SignGoogle.css";

const SignGoogle: React.FC = () => {
    async function googleLogin() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Referências dos documentos no Firestore
            const refDocTags = doc(db, "TagsDespesas", user.uid);
            const refDoc = doc(db, "MesSelecao", user.uid);

            // Verifica e cria 'TagsDespesas' se não existir
            const docSnapTags = await getDoc(refDocTags);
            if (!docSnapTags.exists()) {
                await setDoc(refDocTags, {
                    tags: [
                        "Roupas", "Educação", "Eletrônicos", "Saúde", "Casa",
                        "Lazer", "Restaurante", "Mercado", "Serviços", "Transporte",
                        "Viagem", "Outros"
                    ]
                });
                console.log("Tags armazenadas com sucesso!");
            }

            // Verifica e cria 'MesSelecao' se não existir
            const docSnap = await getDoc(refDoc);
            if (!docSnap.exists()) {
                await setDoc(refDoc, {
                    uid: user.uid,
                    mes: new Date().getMonth()
                });
            }

            // Redireciona após todas as operações de banco de dados estarem concluídas
            window.location.href = '/home';
        } catch (error) {
            console.error("Erro durante o login com Google:", error);
            alert("Erro no login: " + error);
        }
    }

    return (
        <IonButton color={'success'} className="btn-google" onClick={googleLogin} expand='block' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IonIcon slot="start" icon={logoGoogle} className="google-logo" />
            <IonText className="ion-text-uppercase" style={{ flex: 1, textAlign: 'center' }}>
                <p>Sign in with Google</p>
            </IonText>
        </IonButton>
    );
}

export default SignGoogle;
