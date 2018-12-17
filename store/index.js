import ExpenditureStore from './ExpenditureStore'
import EstimationStore from "./EstimationStore";
import NoteStore from './NoteStore'

export default {
    ExpenditureStore: new ExpenditureStore(),
    EstimationStore: new EstimationStore(),
    NoteStore: new NoteStore(),
}