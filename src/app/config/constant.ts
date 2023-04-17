import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class Constants {

    public readonly API_ENDPOINT: string = environment.apiUrl;
    public readonly API_MOCK_ENDPOINT: string = environment.apiMockUrl;
    public readonly API_IS_DEVELOPMENT_ENV: boolean = environment.production;
    public readonly API_OCP_APIM_SUBSCRIPTION_KEY: string = environment.OcpApimSubscriptionKey;
    public readonly API_JUNGLEE_TOKEN: string = environment.JungleeToken;

    //example
    public readonly API_URL_LOGIN: string = 'api/login/user';
    public readonly API_URL_SIGNUP: string = 'api/userRegistration';

    public readonly API_URL_CHANGEPASSWORD: string = 'api/ChangePassword';
    public readonly API_URL_CLIENTDATA: string = 'api/junglee-admin/getClientsData';
    public readonly API_URL_SAVECLIENTDATA: string = 'api/junglee-admin/saveClient';
    public readonly API_URL_UPDATECLIENTDATA: string = 'api/junglee-admin/UpdateClient';
    public readonly API_URL_DELETECLIENTDATA: string = 'api/junglee-admin/deleteUserById';
    public readonly API_URL_SPORTSBET: string = 'api/getUserBets';
    public readonly API_URL_ACCOUNTSTATEMENT: string = 'api/getAccountStatement/all';
    public readonly API_URL_DEVICELOGS: string = 'api/junglee-admin/getUserDeviceLogs';
    public readonly API_URL_SIGNUPLIST: string = 'api/junglee-admin/signUpUserList';
    public readonly API_URL_ADDUSERS: string = '';

    public readonly API_URL_SPORTS: string = 'api/betfairSports'
    public readonly API_URL_SPORTS_TOUR: string = 'api/betfairtournaments'
    public readonly API_URL_SPORTS_TOURNAMENT: string = 'api/betfairtournaments/sport'
    public readonly API_URL_TOURNAMENT_MATCHES: string = 'api/betfairmatches/tournament'
    public readonly API_URL_MATCHES: string = 'api/betfairmatches/match'
    public readonly API_URL_UPDATE_MARKET_STATUS: string = 'api/junglee-admin/saveActiveMarket'

    public readonly API_URL_USER_DETAIL: string = 'api/getUserDetails';

    public readonly API_URL_TERM_CONDITION: string = 'api/termsAndCondition';
    public readonly API_URL_ADD_BANK_DETAILS: string = 'api/saveUserAccountInfo';
    public readonly API_URL_UPDATE_BANK_DETAILS: string = 'api/UpdateUserAccount';
    public readonly API_URL_DELETE_BANK_DETAILS: string = 'api/deleteUserBankinfo';
    public readonly API_URL_DEPOSIT_WITHDRAW_HISTORY: string = 'api/getTransactions';
    public readonly API_URL_ROLES:string = 'api/getRoles'

    public readonly API_URL_GET_BANK_DETAILS: string = 'api/getUserAccountInfo';
    public readonly API_URL_SAVE_TRANSACTION: string = 'api/saveTransactions';
    public readonly API_URL_DEPOSIT_WITHDRAW_HISTORY_STATUS: string = 'api/junglee-admin/getTransactionStatus';
    public readonly API_URL_DEPOSIT_WITHDRAW_HISTORY_STATUS_UPDATE: string = 'api/junglee-admin/updateTransaction';
    public readonly API_URL_DASHBOARD: string = 'api/getDashboardOverview';

    public readonly API_URL_GET_WEBSOCKET_URL: string = 'api/pubsuburl';
    public readonly API_URL_SET_UNSET_WEBSOCKET_DATA: string = 'api/getMarketRates';
    public readonly API_URL_PLACE_BET: string = 'api/placeBet';
    public readonly API_URL_GET_USER_BET: string = 'api/getUserBets';

    public readonly API_URL_LIST_ALL_MENU:string = 'api/getAllMenu';
    public readonly API_URL_LIST_SPORTS_BY_TOUR:string = 'api/getTournamentBySportId';
    public readonly API_URL_LIST_DATA_BY_SEARCH:string = 'api/searchEvent';
    public readonly API_URL_GET_BALANCE_INFO:string = 'api/getBalanceInformation';
    public readonly API_URL_GET_IN_PLAY_UPCOMING:string = 'api/getInPlayData';
    public readonly API_URL_GET_BOOKMAKER_MARKET:string = 'api/getBookMakerMarket';
    public readonly API_URL_GET_FANCY_MARKET:string = 'api/getFancyMarket';
    public readonly API_URL_GET_TERM_COND:string = 'api/termsAndCondition';
    public readonly API_URL_TRANSFER_STATEMENT:string = 'api/getTransferStatement';
    public readonly API_URL_GET_USER_CONFIG:string = 'api/getUserConfig';
    public readonly API_URL_SAVE_USER_CONFIG:string = 'api/saveUserConfig';
    public readonly API_URL_USER_OPEN_BETS:string = 'api/getUserBets';
    public readonly API_URL_OPEN_BETS:string = 'api/getOpenBets';
    public readonly API_URL_PROFIT_LOSS:string = 'api/getProfitAndLoss';
    public readonly API_URL_GET_BET_HISTORY_FOR_USER:string = 'api/getBetHistoryForUser';
    public readonly API_URL_GET_BET_HISTORY_FOR_ACCOUNT_STATEMENT:string = 'api/getBetHistoryForUserAccountStatement';
    public readonly API_URL_BOOKS_MARKET:string = 'api/getBooksForMarket';
    public readonly API_URL_CANCEL_BET:string = 'api/deleteBet';
    public readonly API_URL_ACCOUNT_STATEMENT:string = 'api/getUserAccountStatement';
    public readonly API_URL_LADDER:string = 'api/getLadder';
    public readonly API_URL_LIVE_STREAM_MATCH:string = 'api/getStreamingUrl';
    public readonly API_URL_UNIQUE_DEVICE_KEY:string = 'api/getUniquDeviceId';
    public readonly API_URL_GET_WEBSOCKET_URL_BY_DEVICE:string = 'api/registerDeviceToGetOddsData';


    //pubsub
    public readonly API_URL_GET_USER_ADMIN_PUB_SUB:string = 'api/getUserAdminPubSub';

}
