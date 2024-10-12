import {
  IonContent,
  IonHeader,
  IonMenu,
  IonToolbar,
  IonTitle,
  IonItem,
  IonIcon,
  IonLabel

} from '@ionic/react';
import { signOut } from 'firebase/auth';
import {
  personOutline,
  alertCircleOutline,
  exitOutline,
  starHalfOutline
} from 'ionicons/icons';
import { auth } from '../firebase/firebase';

const Menu: React.FC = () => {
  

  function logout() {
    signOut(auth).then(() => {
      window.location.href = "/";
    }).catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }

  return (

    <IonMenu contentId="main-content" side="end">
      <IonHeader className="ion-no-border">
        <IonToolbar color={'success'}>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{
            '--background': 'var(--ion-background-color)', // Controla o fundo da página
            '--color': 'var(--ion-text-color)', // Controla a cor do texto
          }}>
        <IonItem button={true} href="/Conta" style={{
            '--background': 'var(--ion-background-color)', 
            '--color': 'var(--ion-text-color)',
          }}>
          <IonIcon aria-hidden="true" slot="start" icon={personOutline} style={{'color': 'var(--ion-color-secondary-contrast'}} ></IonIcon>
          <IonLabel style={{'--color': 'var(--ion-text-color)', }}>Sua Conta</IonLabel>
        </IonItem>
        <IonItem button={true} href="/support" style={{
            '--background': 'var(--ion-background-color)',  
            '--color': 'var(--ion-text-color)',
          }}>
          <IonIcon aria-hidden="true" slot="start" icon={alertCircleOutline} style={{'color': 'var(--ion-color-secondary-contrast'}} ></IonIcon>
          <IonLabel style={{'--color': 'var(--ion-text-color)', }}>Support</IonLabel>
        </IonItem>
        <IonItem button={true} href="/avaliacoes" style={{
            '--background': 'var(--ion-background-color)',  
            '--color': 'var(--ion-text-color)',
          }}>
          <IonIcon aria-hidden="true" slot="start" icon={starHalfOutline} style={{'color': 'var(--ion-color-secondary-contrast'}} ></IonIcon>
          <IonLabel style={{'--color': 'var(--ion-text-color)', }}>Avaliação</IonLabel>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
