import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { formatDate } from '../../helpers/utils/util';
import AssetList from '../../components/app/asset-list';
import NFTGallery from '../../components/app/nft-gallery';
import NFTIdentifier from '../../components/app/nft-identifier';
import HomeNotification from '../../components/app/home-notification';
import MultipleNotifications from '../../components/app/multiple-notifications';
import TransactionList from '../../components/app/transaction-list';
import MenuBar from '../../components/app/menu-bar';
import Popover from '../../components/ui/popover';
import Button from '../../components/ui/button';
import ConnectedSites from '../connected-sites';
import ConnectedAccounts from '../connected-accounts';
import { Tabs, Tab } from '../../components/ui/tabs';
import { EthOverview } from '../../components/app/wallet-overview';
import SwapsIntroPopup from '../swaps/intro-popup';
import {
  getRpcPrefsForCurrentProvider,
} from '../../selectors';

import {
  ASSET_ROUTE,
  NFT_ROUTE,
  RESTORE_VAULT_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
  CONNECT_ROUTE,
  CONNECTED_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  AWAITING_SWAP_ROUTE,
  BUILD_QUOTE_ROUTE,
  VIEW_QUOTE_ROUTE,
  CONFIRMATION_V_NEXT_ROUTE,
} from '../../helpers/constants/routes';

const LEARN_MORE_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360045129011-Intro-to-MetaMask-v8-extension';
const LEGACY_WEB3_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/360053147012';

class Home extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    history: PropTypes.object,
    forgottenPassword: PropTypes.bool,
    suggestedTokens: PropTypes.object,
    unconfirmedTransactionsCount: PropTypes.number,
    shouldShowSeedPhraseReminder: PropTypes.bool.isRequired,
    isPopup: PropTypes.bool,
    isNotification: PropTypes.bool.isRequired,
    showRestorePrompt: PropTypes.bool,
    selectedAddress: PropTypes.string,
    setShowRestorePromptToFalse: PropTypes.func,
    firstPermissionsRequestId: PropTypes.string,
    totalUnapprovedCount: PropTypes.number.isRequired,
    setConnectedStatusPopoverHasBeenShown: PropTypes.func,
    connectedStatusPopoverHasBeenShown: PropTypes.bool,
    defaultHomeActiveTabName: PropTypes.string,
    onTabClick: PropTypes.func.isRequired,
    setSwapsWelcomeMessageHasBeenShown: PropTypes.func.isRequired,
    swapsWelcomeMessageHasBeenShown: PropTypes.bool.isRequired,
    haveSwapsQuotes: PropTypes.bool.isRequired,
    showAwaitingSwapScreen: PropTypes.bool.isRequired,
    swapsFetchParams: PropTypes.object,
    swapsEnabled: PropTypes.bool,
    isMainnet: PropTypes.bool,
    shouldShowWeb3ShimUsageNotification: PropTypes.bool.isRequired,
    setWeb3ShimUsageAlertDismissed: PropTypes.func.isRequired,
    originOfCurrentTab: PropTypes.string,
    disableWeb3ShimUsageAlert: PropTypes.func.isRequired,
    pendingConfirmations: PropTypes.arrayOf(PropTypes.object).isRequired,
    rpcPrefs: PropTypes.object,
  };

  state = {
    mounted: false,
  };

  componentDidMount() {
    const {
      firstPermissionsRequestId,
      history,
      isNotification,
      suggestedTokens = {},
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
      pendingConfirmations,
    } = this.props;

    this.setState({ mounted: true });
    if (isNotification && totalUnapprovedCount === 0) {
      global.platform.closeCurrentWindow();
    } else if (!isNotification && showAwaitingSwapScreen) {
      history.push(AWAITING_SWAP_ROUTE);
    } else if (!isNotification && haveSwapsQuotes) {
      history.push(VIEW_QUOTE_ROUTE);
    } else if (!isNotification && swapsFetchParams) {
      history.push(BUILD_QUOTE_ROUTE);
    } else if (firstPermissionsRequestId) {
      history.push(`${ CONNECT_ROUTE }/${ firstPermissionsRequestId }`);
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    } else if (Object.keys(suggestedTokens).length > 0) {
      history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE);
    } else if (pendingConfirmations.length > 0) {
      history.push(CONFIRMATION_V_NEXT_ROUTE);
    }
  }

  static getDerivedStateFromProps(
    {
      firstPermissionsRequestId,
      isNotification,
      suggestedTokens,
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
    },
    { mounted },
  ) {
    if (!mounted) {
      if (isNotification && totalUnapprovedCount === 0) {
        return { closing: true };
      } else if (
        firstPermissionsRequestId ||
        unconfirmedTransactionsCount > 0 ||
        Object.keys(suggestedTokens).length > 0 ||
        (!isNotification &&
          (showAwaitingSwapScreen || haveSwapsQuotes || swapsFetchParams))
      ) {
        return { redirecting: true };
      }
    }
    return null;
  }

  componentDidUpdate(_, prevState) {
    const { showRestorePrompt } = this.props;

    if (!prevState.closing && this.state.closing) {
      global.platform.closeCurrentWindow();
    }
  }

  renderNotifications() {
    const { t } = this.context;
    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
      selectedAddress,
      setShowRestorePromptToFalse,
      showRestorePrompt,
      shouldShowWeb3ShimUsageNotification,
      setWeb3ShimUsageAlertDismissed,
      originOfCurrentTab,
      disableWeb3ShimUsageAlert,
    } = this.props;

    return (
      <MultipleNotifications>
        {shouldShowWeb3ShimUsageNotification ? (
          <HomeNotification
            descriptionText={t('web3ShimUsageNotification', [
              <span
                key="web3ShimUsageNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({ url: LEGACY_WEB3_URL })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={(disable) => {
              setWeb3ShimUsageAlertDismissed(originOfCurrentTab);
              if (disable) {
                disableWeb3ShimUsageAlert();
              }
            }}
            checkboxText={t('dontShowThisAgain')}
            checkboxTooltipText={t('canToggleInSettings')}
            key="home-web3ShimUsageNotification"
          />
        ) : null}
        {shouldShowSeedPhraseReminder ? (
          <HomeNotification
            descriptionText={t('backupApprovalNotice')}
            acceptText={t('backupNow')}
            onAccept={() => {
              if (isPopup) {
                global.platform.openExtensionInBrowser(
                  INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
                );
              } else {
                history.push(INITIALIZE_BACKUP_SEED_PHRASE_ROUTE);
              }
            }}
            infoText={t('backupApprovalInfo')}
            key="home-backupApprovalNotice"
          />
        ) : null}
      </MultipleNotifications>
    );
  }

  renderPopover = () => {
    const { setConnectedStatusPopoverHasBeenShown } = this.props;
    const { t } = this.context;
    return (
      <Popover
        title={t('whatsThis')}
        onClose={setConnectedStatusPopoverHasBeenShown}
        className="home__connected-status-popover"
        showArrow
        CustomBackground={({ onClose }) => {
          return (
            <div
              className="home__connected-status-popover-bg-container"
              onClick={onClose}
            >
              <div className="home__connected-status-popover-bg" />
            </div>
          );
        }}
        footer={
          <>
            <a href={LEARN_MORE_URL} target="_blank" rel="noopener noreferrer">
              {t('learnMore')}
            </a>
            <Button
              type="primary"
              onClick={setConnectedStatusPopoverHasBeenShown}
            >
              {t('dismiss')}
            </Button>
          </>
        }
      >
        <main className="home__connect-status-text">
          <div>{t('metaMaskConnectStatusParagraphOne')}</div>
          <div>{t('metaMaskConnectStatusParagraphTwo')}</div>
          <div>{t('metaMaskConnectStatusParagraphThree')}</div>
        </main>
      </Popover>
    );
  };

  render() {
    const { t } = this.context;
    const {
      defaultHomeActiveTabName,
      onTabClick,
      forgottenPassword,
      history,
      connectedStatusPopoverHasBeenShown,
      isPopup,
      swapsWelcomeMessageHasBeenShown,
      setSwapsWelcomeMessageHasBeenShown,
      swapsEnabled,
      isMainnet,
      rpcPrefs,
    } = this.props;

    if (forgottenPassword) {
      return <Redirect to={{ pathname: RESTORE_VAULT_ROUTE }} />;
    } else if (this.state.closing || this.state.redirecting) {
      return null;
    }

    return (
      <div className="main-container">
        <Route path={CONNECTED_ROUTE} component={ConnectedSites} exact />
        <Route
          path={CONNECTED_ACCOUNTS_ROUTE}
          component={ConnectedAccounts}
          exact
        />
        <div className="home__container">
          {!swapsWelcomeMessageHasBeenShown && swapsEnabled && isMainnet ? (
            <SwapsIntroPopup onClose={setSwapsWelcomeMessageHasBeenShown} />
          ) : null}
          {isPopup && !connectedStatusPopoverHasBeenShown
            ? this.renderPopover()
            : null}
          <div className="home__main-view">
            <MenuBar />
            <div className="home__balance-wrapper">
              <EthOverview />
            </div>
            {
              rpcPrefs.ticker === 'STC' ? (
                <Tabs
                  defaultActiveTabName={defaultHomeActiveTabName}
                  onTabClick={onTabClick}
                  tabsClassName="home__tabs"
                >
                  <Tab
                    activeClassName="home__tab--active"
                    className="home__tab"
                    data-testid="home__asset-tab"
                    name={t('assets')}
                  >
                    <AssetList
                      onClickAsset={(asset) =>
                        history.push(`${ ASSET_ROUTE }/${ asset }`)
                      }
                    />
                  </Tab>
                  <Tab
                    activeClassName="home__tab--active"
                    className="home__tab"
                    data-testid="home__nftGallery-tab"
                    name={t('nftGallery')}
                  >
                    <NFTGallery
                      onClickNFT={(nft) => history.push(`${ NFT_ROUTE }/${ nft }`)}
                    />
                  </Tab>
                  <Tab
                    activeClassName="home__tab--active"
                    className="home__tab"
                    data-testid="home__nftIdentifier-tab"
                    name={t('nftIdentifier')}
                  >
                    <NFTIdentifier />
                  </Tab>
                  <Tab
                    activeClassName="home__tab--active"
                    className="home__tab"
                    data-testid="home__activity-tab"
                    name={t('activity')}
                  >
                    <TransactionList />
                  </Tab>
                </Tabs>
              ) : (
                <Tabs
                  defaultActiveTabName={defaultHomeActiveTabName}
                  onTabClick={onTabClick}
                  tabsClassName="home__tabs"
                >
                  <Tab
                    activeClassName="home__tab--active"
                    className="home__tab"
                    data-testid="home__asset-tab"
                    name={t('assets')}
                  >
                    <AssetList
                      onClickAsset={(asset) =>
                        history.push(`${ ASSET_ROUTE }/${ asset }`)
                      }
                    />
                  </Tab>
                  <Tab
                    activeClassName="home__tab--active"
                    className="home__tab"
                    data-testid="home__activity-tab"
                    name={t('activity')}
                  >
                    <TransactionList />
                  </Tab>
                </Tabs>
              )
            }
          </div>
          {this.renderNotifications()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rpcPrefs: getRpcPrefsForCurrentProvider(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
