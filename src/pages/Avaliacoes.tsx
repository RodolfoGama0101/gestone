import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
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
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
  } from "@ionic/react";
  import { arrowBackOutline, star, starOutline } from "ionicons/icons";
  import { useEffect, useState } from "react";
  import "./css/Avaliacoes.css";
  import { collection, doc, getAggregateFromServer, getCountFromServer, getDoc, query, setDoc, sum } from "firebase/firestore";
  import { auth, db } from "../firebase/firebase";
  import { onAuthStateChanged } from "firebase/auth";
  import RatingStars from "../components/RatingStars";
  
  const Avaliacoes: React.FC = () => {
    const [rating, setRating] = useState<number>(0);
    const [userInfo, setUserInfo] = useState(Object);
    const [comment, setComment] = useState<string>("");
    const [userRatingData, setUserRatingData] = useState(Object);
    const [isOpen, setIsOpen] = useState(false);
    const [mediaStars, setMediaStars] = useState(String);
  
    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserInfo(user);
        }
      });
  
      mediaUserRating();
    }, []);
  
    const handleRating = (index: number) => {
      setRating(index);
    };
  
    async function addRating() {
      const docRef = doc(db, "UserRating", userInfo.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        window.alert("Você já fez uma avaliação!");
        setRating(0);
        setComment("");
      } else {
        try {
          await setDoc(doc(db, "UserRating", userInfo.uid), {
            uid: userInfo.uid,
            stars: rating,
            comment: comment,
            UserName: userInfo.displayName,
          });
          setRating(0);
          setComment("");
          window.alert("Comentário enviado!");
        } catch (error) {
          window.alert(error);
        }
      }
    }
  
    async function mediaUserRating() {
      const coll = collection(db, "UserRating");
      const snapshotSum = await getAggregateFromServer(coll, {
        sumStars: sum("stars"),
      });
      const snapshotCount = await getCountFromServer(coll);
      const mediaStars: any = snapshotSum.data().sumStars / snapshotCount.data().count;
      setMediaStars(mediaStars.toFixed(1));
    }
  
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
  
        <IonContent>
          <IonGrid>
            <IonRow class="ion-justify-content-center ion-align-items-center">
              <IonButton
                color={"success"}
                onClick={() => setIsOpen(true)}
                className="button-avaliar"
              >
                <IonText>Avaliar</IonText>
              </IonButton>
            </IonRow>
          </IonGrid>
          </IonContent>
  
          <IonModal isOpen={isOpen} className="custom-modal" backdropDismiss={false}>
            <IonHeader>
              <IonToolbar color="success">
                <IonButtons slot="start">
                  <IonButton onClick={() => setIsOpen(false)}>
                    <IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} />
                  </IonButton>
                </IonButtons>
                <IonTitle>Voltar</IonTitle>
              </IonToolbar>
            </IonHeader>
  
            <IonContent className="card-input-avaliacoes">
              <div className="modal-content">
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
  
                <div className="comentario-container">
                  <IonTextarea
                    counter={true}
                    maxlength={150}
                    fill="outline"
                    label="Comentário: "
                    className="input-avaliacoes"
                    labelPlacement="stacked"
                    color={"success"}
                    value={comment}
                    onIonChange={(e: any) => setComment(e.detail.value)}
                  />
                  <IonButton className="submit-button" color="success" onClick={() => { addRating(); setIsOpen(false); }}>
                    Enviar avaliação
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>
  
          <IonContent color={''} className="content-verde">
            {userRatingData && (
              <IonCard className="custom-card">
                <IonCardContent>
                  <IonText>
                    <p>Usuário: {userInfo.displayName}</p>
                    <p>Estrelas: {userRatingData.stars}</p>
                    <p>Comentário: {userRatingData.comment}</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            )}
          </IonContent>
  
          {/* <IonCard className="custom-card media-card">
            <IonCardContent>
              <IonCardTitle>Média de Avaliações</IonCardTitle>
              <RatingStars rating={parseFloat(mediaStars)} />
            </IonCardContent>
          </IonCard> */}
        </IonPage>
      );
    };
    
    export default Avaliacoes;
  