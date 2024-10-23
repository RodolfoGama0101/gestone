import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonCardContent,
    IonCard,
    IonButton,
    IonTextarea,
    IonCardTitle,
    IonText,
    IonModal
} from "@ionic/react";
import { arrowBackOutline, star, starOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import "./css/Avaliacoes.css";
import { doc, getDoc, query, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Avaliacoes: React.FC = () => {
    // Estado para armazenar a avaliação (1 a 5)
    const [rating, setRating] = useState<number>(0);
    const [userInfo, setUserInfo] = useState(Object);
    const [comment, setComment] = useState<string>("");
    const [userRatingData, setUserRatingData] = useState(Object);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserInfo(user);
            }
        })
    })

    // Função para atualizar o estado da avaliação
    const handleRating = (index: number) => {
        setRating(index);
    };

    async function addRating() {
        const docRef = doc(db, "UserRating", userInfo.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            window.alert("Você já vez uma avaliação!");
            setRating(0);
            setComment("");
        } else {
            try {
                await setDoc(doc(db, "UserRating", userInfo.uid), {
                    uid: userInfo.uid,
                    stars: rating,
                    comment: comment,
                    UserName: userInfo.displayName
                });
                setRating(0);
                setComment("");
                window.alert("Comentário enviado!")
            } catch (error) {
                window.alert(error)
            }
        }
    }

    async function userRating(User: string) {
        const docRef = doc(db, "UserRating", userInfo.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUserRatingData(docSnap.data(),);
            console.log("teste")
        } else {

        }
    }

    useEffect(() => {
        if (userInfo) {
            userRating(userInfo.uid); // Carrega os dados de avaliação quando userInfo estiver definido
        }
    }, [userInfo]);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={"success"}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home" color={"light"}></IonBackButton>
                    </IonButtons>
                    <IonTitle>Avaliações</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-justfy-content-center">

                <IonButton color={'success'} onClick={() => setIsOpen(true)} className="ion-justify-content-center" style={{
                    '--background': 'var(--ion-background-color)', // Controla o fundo da página
                    '--color': 'var(--ion-text-color)', // Controla a cor do texto
                }}>
                    <IonText >Avaliar</IonText>
                </IonButton>

            </IonContent>

            <IonModal isOpen={isOpen} className="custom-modal" backdropDismiss={false}>
                <IonHeader>
                    <IonToolbar color="success">
                        <IonButtons slot="start">
                            <IonButton onClick={() => setIsOpen(false)}><IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} /></IonButton>
                        </IonButtons>
                        <IonText>Voltar</IonText>
                    </IonToolbar>
                </IonHeader>

                <div className="modal-content">
                    <IonContent className="card-input-avaliacoes">

                        {/* Sistema de avaliação por estrelas */}
                        <div className="star-rating">
                            {Array.from({ length: 5 }, (_, index) => (
                                <IonIcon
                                    key={index}
                                    icon={index < rating ? star : starOutline}
                                    className="star"
                                    color={"warning"}
                                    onClick={() => handleRating(index + 1)}
                                />
                            ))}
                        </div>

                        {/* Campo de comentário */}
                        <div className="comentario-container">
                            <div className="comentario">
                                <IonTextarea
                                    counter={true} 
                                    maxlength={200}
                                    fill="outline"
                                    label="Comentário: "
                                    className="input-avaliacoes"
                                    labelPlacement="stacked"
                                    color={"success"}
                                    value={comment}
                                    onIonChange={(e: any) => setComment(e.target.value)}
                                />
                            </div>

                            <IonButton className="submit-button" color="success" onClick={() => { addRating(), setIsOpen(false) }}>
                                Enviar avaliação
                            </IonButton>
                        </div>


                    </IonContent>
                </div>
            </IonModal>



            <IonContent>
                {userRatingData && (
                    <IonCard className="custom-card">
                        <IonCardContent>
                            <IonText>
                                <p>User: {userInfo.displayName}</p>
                                <p>Estrelas: {userRatingData.stars}</p>
                                <p>Comentário: {userRatingData.comment}</p>
                            </IonText>
                        </IonCardContent>
                    </IonCard>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Avaliacoes;
