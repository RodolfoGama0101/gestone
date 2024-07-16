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
  document,
  personOutline,
  alertCircleOutline,
  exitOutline
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
        <IonToolbar color={'medium'}>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" color={'dark'}>
        <IonItem button={true} href="/dados-pessoais" color={'dark'}>
          <IonIcon aria-hidden="true" slot="start" icon={document}></IonIcon>
          <IonLabel>Dados Pessoais</IonLabel>
        </IonItem>
        <IonItem button={true} href="/sua-conta" color={'dark'}>
          <IonIcon aria-hidden="true" slot="start" icon={personOutline}></IonIcon>
          <IonLabel>Sua Conta</IonLabel>
        </IonItem>
        <IonItem button={true} href="/suporte" color={'dark'}>
          <IonIcon aria-hidden="true" slot="start" icon={alertCircleOutline}></IonIcon>
          <IonLabel>Support</IonLabel>
        </IonItem>
        <IonItem button={true} href="/login" color={'dark'} onClick={logout}>
          <IonIcon aria-hidden="true" slot="start" icon={exitOutline}></IonIcon>
          <IonLabel>Logout</IonLabel>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
