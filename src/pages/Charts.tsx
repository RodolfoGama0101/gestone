import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './Charts.css';
import FooterTabBar from '../components/FooterTabBar';
import { personCircleOutline } from 'ionicons/icons';
import Verifica from '../firebase/verifica';


const Charts: React.FC = () => {
  Verifica();

  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText className='ion-text-center'>
            <h1>Grafics</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent>

      </IonContent>

      <FooterTabBar></FooterTabBar>
    </IonPage>
  );
};

export default Charts;
