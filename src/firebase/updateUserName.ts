import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth();

const updateUserName = async (name: string) => {
    if (auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
            });
            console.log("Nome do usuário atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar o nome do usuário:", error);
        }
    }
};

export default updateUserName;
