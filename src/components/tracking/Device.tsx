import { useDispatch, useSelector } from 'react-redux';
import { ReactElement, useCallback } from 'react';
import { FontAwesomeIcon } from 'fm3/components/FontAwesomeIcon';
import { trackingActions } from 'fm3/actions/trackingActions';
import { setActiveModal } from 'fm3/actions/mainActions';
import { Device as DeviceType } from 'fm3/types/trackingTypes';
import { useMessages } from 'fm3/l10nInjector';
import { RootState } from 'fm3/storeCreator';
import { toastsAdd } from 'fm3/actions/toastsActions';
import { getType } from 'typesafe-actions';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

type Props = {
  device: DeviceType;
};

export function Device({ device }: Props): ReactElement {
  const m = useMessages();

  const dispatch = useDispatch();

  const language = useSelector((state: RootState) => state.l10n.language);

  const dateFormat = new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleModify = useCallback(() => {
    dispatch(trackingActions.modifyDevice(device.id));
  }, [device.id, dispatch]);

  const handleDelete = useCallback(() => {
    dispatch(
      toastsAdd({
        id: 'tracking.deleteDevice',
        messageKey: 'tracking.devices.delete',
        style: 'warning',
        cancelType: [
          getType(trackingActions.modifyDevice),
          getType(trackingActions.modifyTrackedDevice),
          getType(trackingActions.showAccessTokens),
          getType(setActiveModal),
        ],
        actions: [
          {
            nameKey: 'general.yes',
            action: trackingActions.deleteDevice(device.id),
            style: 'danger',
          },
          { nameKey: 'general.no' },
        ],
      }),
    );
  }, [device.id, dispatch]);

  const handleShowAccessTokens = useCallback(() => {
    dispatch(trackingActions.showAccessTokens(device.id));
  }, [device.id, dispatch]);

  const handleView = useCallback(() => {
    dispatch(setActiveModal('tracking-watched'));
    dispatch(trackingActions.modifyTrackedDevice(device.id));
  }, [device.id, dispatch]);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(
      `${process.env.API_URL}/tracking/track/${device.token}`,
    );
  }, [device.token]);

  return (
    <tr>
      <td>{device.name}</td>
      <td>
        {device.token.startsWith('did:')
          ? `${device.token.slice(4)} (TK102B Device ID)`
          : device.token.startsWith('imei:')
          ? `${device.token.slice(5)} (TK102B IMEI)`
          : device.token}
        {!device.token.includes(':') && (
          <>
            {' '}
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="right"
              overlay={
                <Tooltip id={device.token}>
                  <span style={{ overflowWrap: 'break-word' }}>
                    {process.env.API_URL}/tracking/track/{device.token}
                  </span>
                </Tooltip>
              }
            >
              <span>
                {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? (
                  <Button
                    onClick={handleCopyClick}
                    size="sm"
                    title={m?.external.copy}
                    type="button"
                  >
                    <FontAwesomeIcon icon="clipboard" />
                  </Button>
                ) : (
                  <FontAwesomeIcon icon="mobile" />
                )}
              </span>
            </OverlayTrigger>
          </>
        )}
      </td>
      <td>{device.maxCount}</td>
      <td>
        {typeof device.maxAge === 'number'
          ? `${device.maxAge / 60} ${m?.general.minutes}`
          : ''}
      </td>
      <td>{dateFormat.format(device.createdAt)}</td>
      <td>
        <Button
          size="sm"
          type="button"
          onClick={handleModify}
          title={m?.general.modify}
        >
          <FontAwesomeIcon icon="edit" />
        </Button>{' '}
        <Button
          size="sm"
          type="button"
          variant="primary"
          onClick={handleShowAccessTokens}
          title={m?.tracking.devices.watchTokens}
        >
          <FontAwesomeIcon icon="key" />
        </Button>{' '}
        <Button
          size="sm"
          type="button"
          onClick={handleView}
          title={m?.tracking.devices.watchPrivately}
        >
          <FontAwesomeIcon icon="eye" />
        </Button>{' '}
        <Button
          variant="danger"
          size="sm"
          type="button"
          onClick={handleDelete}
          title={m?.general.delete}
        >
          <FontAwesomeIcon icon="close" />
        </Button>
      </td>
    </tr>
  );
}
