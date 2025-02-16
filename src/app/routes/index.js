import { Settings } from "../components/Settings";
import { Main } from "./Main";
import { BookmarkList } from './BookmarkList';
import { History } from "./History";  // NEW

export const routeToComp = {
    main: Main,
    settings: Settings,
    'bookmark-list': BookmarkList,
    history: History   // NEW
};