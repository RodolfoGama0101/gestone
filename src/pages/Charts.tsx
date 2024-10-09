import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonToolbar } from '@ionic/react';
import './css/Cadastro.css';
import Verifica from '../firebase/verifica';
import ChartBar from '../components/ChartBar';
import { ThemeContext } from '../components/ThemeContext';
import { useContext } from 'react';


const Charts: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);

  Verifica();

  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar style={{
        '--background': 'var(--ion-background-color)', // Controla o fundo da página
        '--color': 'var(--ion-text-color)', // Controla a cor do texto
      }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText>
            <h1 className='ion-margin'>Charts</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{
        '--background': 'var(--ion-background-color)', // Controla o fundo da página
        '--color': 'var(--ion-text-color)', // Controla a cor do texto
      }}>
        <ChartBar></ChartBar>
      </IonContent>
    </IonPage>
  );
};

export default Charts;