import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, ReactElement, useState } from 'react';

import { FontAwesomeIcon } from 'fm3/components/FontAwesomeIcon';
import { trackingActions } from 'fm3/actions/trackingActions';
import { DateTime } from 'fm3/components/DateTime';
import { toDatetimeLocal } from 'fm3/dateUtils';
import { useTextInputState } from 'fm3/hooks/inputHooks';
import { useMessages } from 'fm3/l10nInjector';
import { RootState } from 'fm3/storeCreator';
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from 'react-bootstrap';

export function AccessTokenForm(): ReactElement {
  const m = useMessages();

  const dispatch = useDispatch();

  const accessToken = useSelector((state: RootState) =>
    state.tracking.modifiedAccessTokenId
      ? state.tracking.accessTokens.find(
          (accessToken) =>
            accessToken.id === state.tracking.modifiedAccessTokenId,
        )
      : undefined,
  );

  const deviceName = useSelector(
    (state: RootState) =>
      (
        state.tracking.devices.find(
          (device) => device.id === state.tracking.accessTokensDeviceId,
        ) || { name: '???' }
      ).name,
  );

  const [note, setNote] = useTextInputState(accessToken?.note ?? '');

  const [timeFrom, setTimeFrom] = useState(
    accessToken?.timeFrom ? toDatetimeLocal(accessToken.timeFrom) : '',
  );

  const [timeTo, setTimeTo] = useState(
    accessToken?.timeTo ? toDatetimeLocal(accessToken.timeTo) : '',
  );

  // const [listingLabel, setListingLabel] = useTextInputState(
  //   accessToken?.listingLabel ?? '',
  // );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(
      trackingActions.saveAccessToken({
        note: note.trim() || null,
        timeFrom: timeFrom === '' ? null : new Date(timeFrom),
        timeTo: timeTo === '' ? null : new Date(timeTo),
        listingLabel: null, // listingLabel.trim() || null,
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon="bullseye" />{' '}
          {accessToken
            ? m?.tracking.accessTokens.modifyTitle({
                token: accessToken.token,
                deviceName,
              })
            : m?.tracking.accessTokens.createTitle(deviceName)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <FormLabel>{m?.tracking.accessToken.timeFrom}</FormLabel>
          <DateTime value={timeFrom} onChange={setTimeFrom} />
        </FormGroup>
        <FormGroup>
          <FormLabel>{m?.tracking.accessToken.timeTo}</FormLabel>
          <DateTime value={timeTo} onChange={setTimeTo} />
        </FormGroup>
        {/* <FormGroup>
          <FormLabel>{m?.tracking.accessToken.listingLabel}</FormLabel>
          <FormControl
            value={listingLabel}
            onChange={setListingLabel}
            maxLength={255}
          />
        </FormGroup> */}
        <FormGroup>
          <FormLabel>{m?.tracking.accessToken.note}</FormLabel>
          <FormControl value={note} onChange={setNote} maxLength={255} />
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit">{m?.general.save}</Button>
        <Button
          type="button"
          onClick={() => {
            dispatch(trackingActions.modifyAccessToken(undefined));
          }}
        >
          {m?.general.cancel} <kbd>Esc</kbd>
        </Button>
      </Modal.Footer>
    </form>
  );
}
