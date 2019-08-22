import { getMapLeafletElement } from 'fm3/leafletElementHolder';
import { mapRefocus } from 'fm3/actions/mapActions';
import {
  routePlannerSetStart,
  routePlannerSetFinish,
} from 'fm3/actions/routePlannerActions';
import { IProcessor } from 'fm3/middlewares/processorMiddleware';
import { LatLon } from 'fm3/types/common';
import { isActionOf } from 'typesafe-actions';

export const routePlannerRefocusMapProcessor: IProcessor<
  typeof routePlannerSetStart | typeof routePlannerSetFinish
> = {
  actionCreator: [routePlannerSetStart, routePlannerSetFinish],
  handle: async ({ dispatch, getState, action }) => {
    const {
      routePlanner: { start, finish },
    } = getState();

    let focusPoint: LatLon | null | undefined;
    if (isActionOf(routePlannerSetStart, action)) {
      focusPoint = start;
    } else if (isActionOf(routePlannerSetFinish, action)) {
      focusPoint = finish;
    }

    const le = getMapLeafletElement();

    if (
      focusPoint &&
      le &&
      !le.getBounds().contains({ lat: focusPoint.lat, lng: focusPoint.lon })
    ) {
      dispatch(mapRefocus({ lat: focusPoint.lat, lon: focusPoint.lon }));
    }
  },
};