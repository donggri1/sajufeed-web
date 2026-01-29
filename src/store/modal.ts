import {create} from 'zustand';

interface SajuFormSate{
    birthDate : Date | undefined;
    birthTime : string;
    gender : string;
    isSolar : string;
    setBirthDate : (date :Date) => void;
    setBirthTime : (time :string) => void;
    setGender : (gender :string) => void;
    setIsSolar : (isSolar :string) => void;
}
export const useSajuStore = create<SajuFormSate>((set)=>({
    birthDate : undefined,
    birthTime : '',
    gender : 'male',
    isSolar: 'solar',
    setBirthDate : (date :Date) => set({birthDate : date}),
    setBirthTime : (time :string) => set({birthTime : time}),
    setGender : (gender :string) => set({gender : gender}),
    setIsSolar : (isSolar :string) => set({isSolar : isSolar})
}))