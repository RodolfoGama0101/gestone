import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
    IonContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonButton,
    IonAvatar,
    IonFooter,
    IonModal,
    IonInput,
    IonCard,
    IonCardContent,
} from '@ionic/react';
import "./css/Conta.css";
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { arrowBackOutline, brushOutline, pencil, pencilOutline } from 'ionicons/icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const Conta: React.FC = () => {
    const [userImg, setUserImg] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState<string | null>(userName);
    const [newEmail, setNewEmail] = useState<string | null>(userEmail);
    const [receitaTotal, setReceitaTotal] = useState(Number);
    const [despesaTotal, setDespesaTotal] = useState(Number);
    const [despesasAnoAgrupadas, setDespesasAnoAgrupadas] = useState<number[]>(Array(12).fill(0));

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserImg(user.photoURL);
                setUserName(user.displayName);
                setUserEmail(user.email);
                setNewName(user.displayName);
                setNewEmail(user.email);
            } else {
                setUserImg(null);
                setUserName(null);
                setUserEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);

    function logout() {
        signOut(auth).then(() => {
            window.location.href = "/";
        }).catch((error) => {
            alert(error.message);
        });
    }

    const toggleEditName = () => {
        setIsEditingName(!isEditingName);
    };

    // Bar Chart
    const dataBar = {
        labels: ['Receitas', 'Despesas'],
        datasets: [{
            data: [receitaTotal, despesaTotal],
            backgroundColor: [
                'rgba(46, 161, 77, 0.6)',
                'rgba(197, 0, 15, 0.6)',
            ],
            borderColor: [
                'rgba(46, 161, 77, 1)',
                'rgba(197, 0, 15, 1)',
            ],
            borderWidth: 1
        }]
    };

    const optionsBar = {
        maintainAspectRatio: false,
        aspectRatio: 2, // Proporção largura/altura
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#FFFFFF', // Cor branca para os valores do eixo Y
                },
                grid: {
                    color: '#555555', // Opcional: cor da linha do grid
                }
            },
            x: {
                ticks: {
                    color: '#FFFFFF', // Cor branca para os valores do eixo X
                },
                grid: {
                    color: '#555555', // Opcional: cor da linha do grid
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }

    const dataDespesasAno = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [
            {
                label: 'Despesas por Mês',
                data: despesasAnoAgrupadas, // Valores agrupados por mês
                borderColor: 'rgba(197, 0, 15, 1)',
                backgroundColor: 'rgba(197, 0, 15, 0.3)',
                fill: true, // Preencher a área abaixo da linha
            },
        ],
    };

    const optionsLineBar = {
        maintainAspectRatio: true, // Mantém a proporção definida
        responsive: true, // O gráfico se ajustará dinamicamente ao contêiner
        aspectRatio: 2.5, // Aumentar a proporção para dar mais largura ao gráfico
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: 'var(--ion-text-color)', // Usa a cor do texto do tema
                },
                grid: {
                    color: 'var(--ion-border-color)', // Usa a cor da borda do tema
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'var(--ion-text-color)', // Usa a cor do texto do tema
                },
                grid: {
                    color: 'var(--ion-border-color)', // Usa a cor da borda do tema
                }
            },
        },
        plugins: {
            legend: {
                display: false, // Remove a legenda se não for necessária
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.label}: R$${tooltipItem.raw.toFixed(2)}`;
                    },
                },
            },
        },
    };

    const handleSaveName = async () => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: newName });
                setUserName(newName);
                window.alert("Nome alterado com sucesso!");
            } else {
                window.alert("Usuário não autenticado.");
            }
        } catch (error) {
            console.error("Erro ao atualizar o nome:", error);
            window.alert("Erro ao atualizar o nome.");
        } finally {
            setIsEditingName(false); // Garante que o estado de edição seja fechado
        }
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Sua Conta</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol className="user-info">
                            {userImg ? (
                                <IonAvatar className="user-photo">
                                    <IonImg src={userImg} />
                                </IonAvatar>
                            ) : (
                                <IonAvatar className="user-photo">
                                    <IonImg src="/assets/default-avatar.png" />
                                </IonAvatar>
                            )}
                        </IonCol>
                    </IonRow>

                    <IonGrid>
                        <div className="ion-text-center">
                            <h2 className="ion-text-capitalize">
                                {userName ? userName : 'Carregando...'}
                            </h2>
                            <p>{userEmail ? userEmail : 'Carregando...'}</p>
                        </div>

                        <div className="ion-text-center">
                            <IonButton onClick={() => setIsOpen(true)} className="ion-justify-content-center">
                                Editar
                            </IonButton>
                        </div>



                        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} backdropDismiss={false}>
                            <IonHeader>
                                <IonToolbar color="success">
                                    <IonButtons slot="start">
                                        <IonButton onClick={() => setIsOpen(false)}>
                                            <IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} />
                                        </IonButton>
                                    </IonButtons>
                                    <IonTitle>Editar Perfil</IonTitle>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-padding">
                                <IonGrid>
                                    <IonRow className="ion-justify-content-center ion-align-items-center">
                                        <IonCol size="auto" style={{ position: 'relative' }}>
                                            <IonAvatar className="user-photo">
                                                <IonImg src={userImg || "/assets/default-avatar.png"} />
                                            </IonAvatar>
                                            <IonButton
                                                shape='round'
                                                size="large"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '0',
                                                    right: '0',
                                                    margin: 0
                                                }}
                                            >
                                                <IonIcon color='success' icon={pencilOutline} />
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>

                                    {/* Edição do Nome */}
                                    
                                    <IonRow style={{ display: 'flex', alignItems: 'center', marginTop: '0' }}>
                                        <IonCol>
                                            {isEditingName ? (
                                                <IonInput
                                                    value={newName}
                                                    onIonChange={(e) => setNewName(e.detail.value!)}
                                                    placeholder="Digite o novo nome"
                                                    label='Nome: '
                                                />
                                            ) : (
                                                <IonText className="ion-text-capitalize">Nome: {userName}</IonText>
                                            )}
                                        </IonCol>
                                        
                                            <IonButton fill="clear" onClick={toggleEditName}>
                                                <IonIcon icon={brushOutline} color={'success'} />
                                            </IonButton>
                                        
                                    </IonRow>

                                    {isEditingName && (
                                        <IonRow className="ion-justify-content-center ion-margin-top">
                                            <IonButton color="success" onClick={handleSaveName}>
                                                Salvar Nome
                                            </IonButton>
                                            <IonButton color="medium" onClick={toggleEditName}>
                                                Cancelar
                                            </IonButton>
                                        </IonRow>
                                    )}
                                </IonGrid>
                            </IonContent>
                        </IonModal>
                    </IonGrid>

                    <IonGrid>
                        <IonRow>
                            <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='6' sizeXl='6'>
                                <IonCard className='card-2 ion-padding' style={{
                                    '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                                    '--color': 'var(--ion-text-color)',
                                }}>
                                    <IonCardContent>
                                        <IonText className='ion-text-center'>
                                            <h1>Balanço Mensal</h1>
                                        </IonText>
                                        <IonCol size='auto'>
                                            <div className="chart-bar-container">
                                                <Bar data={dataBar} options={optionsBar} />
                                            </div>
                                        </IonCol>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            {/* ChartPie Tags */}
                            <IonCol sizeXs='12' sizeSm='12' sizeMd='12' sizeLg='6' sizeXl='6'>
                                <IonCard className='card-2 ion-padding' style={{
                                    '--background': 'var(--ion-color-primary-shade)', // Controla o fundo da página
                                    '--color': 'var(--ion-text-color)',
                                }}>
                                    <IonCardContent>
                                        <IonText className='ion-text-center'>
                                            <h1>Resumo dos Meses</h1>
                                        </IonText>
                                        <IonCol size='auto'>
                                            <div className="chart-pie-container" >
                                                <Line data={dataDespesasAno} options={optionsLineBar} />
                                            </div>
                                        </IonCol>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>


                </IonGrid>
            </IonContent>

            <IonFooter className="ion-no-border footer-logout">
                <IonToolbar>
                    <IonButton expand="block" color="danger" onClick={logout}>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Conta;
