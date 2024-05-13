import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import HeaderComponent from '../components/Header';
import './Charts.css';

const Charts: React.FC = () => {
  return (
    <IonPage>

      <HeaderComponent></HeaderComponent>

      <IonContent fullscreen>
        <h1 className='ion-text-center'>Charts</h1>
      </IonContent>
    </IonPage>
  );
};

export default Charts;
