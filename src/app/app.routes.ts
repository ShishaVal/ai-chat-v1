import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ThankYouComponent} from "./thank-you/thank-you.component";

export const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'thank-you', component: ThankYouComponent }
];
