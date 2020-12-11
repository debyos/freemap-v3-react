import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback, useRef, ReactElement } from 'react';
import { FontAwesomeIcon } from 'fm3/components/FontAwesomeIcon';
import { selectFeature, Tool, clearMap } from 'fm3/actions/mainActions';
import { useMessages } from 'fm3/l10nInjector';
import { RootState } from 'fm3/storeCreator';
import { toolDefinitions } from 'fm3/toolDefinitions';
import { is } from 'typescript-is';
import { Button, Popover } from 'react-bootstrap';
import Overlay from 'react-overlays/esm/Overlay';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

export function ToolsMenuButton(): ReactElement {
  const m = useMessages();

  const dispatch = useDispatch();

  const tool = useSelector((state: RootState) => state.main.selection?.type);

  const expertMode = useSelector((state: RootState) => state.main.expertMode);

  const [show, setShow] = useState(false);

  const button = useRef<HTMLElement | null>(null);

  const handleButtonClick = useCallback(() => {
    setShow(true);
  }, []);

  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  const handleToolSelect = useCallback(
    (tool: unknown) => {
      if (is<Tool | null>(tool)) {
        setShow(false);

        dispatch(selectFeature(tool ? { type: tool } : null));
      }
    },
    [dispatch],
  );

  const handleMapClear = useCallback(() => {
    setShow(false);
    dispatch(clearMap());
  }, [dispatch]);

  const toolDef = toolDefinitions.find(
    (t) =>
      t.tool ===
      (tool === 'draw-polygons' || tool === 'draw-points'
        ? 'draw-lines'
        : tool),
  ) || { tool: null, icon: 'briefcase', msgKey: 'none' };

  return (
    <>
      <Button
        ref={button}
        onClick={handleButtonClick}
        title={m?.tools.tools}
        id="tools-button"
        variant="primary"
      >
        <FontAwesomeIcon icon={toolDef ? toolDef.icon : 'briefcase'} />
        <span className="hidden-xs">
          {' '}
          {m?.tools[tool && toolDef ? toolDef.msgKey : 'tools']}
        </span>
      </Button>
      {tool && <FontAwesomeIcon icon="chevron-right" />}
      <Overlay
        rootClose
        placement="bottom"
        show={show}
        onHide={handleHide}
        target={button.current}
      >
        <Popover id="popover-trigger-click-root-close" className="fm-menu">
          <ul>
            {tool && (
              <DropdownItem onSelect={handleToolSelect}>
                <FontAwesomeIcon icon="briefcase" /> {m?.tools.none}{' '}
                <kbd>Esc</kbd>
              </DropdownItem>
            )}

            <DropdownItem onSelect={handleMapClear}>
              <FontAwesomeIcon icon="eraser" /> {m?.main.clearMap} <kbd>g</kbd>{' '}
              <kbd>c</kbd>
            </DropdownItem>
            <DropdownItem divider />

            {toolDefinitions
              .filter(({ expertOnly }) => expertMode || !expertOnly)
              .map(
                ({ tool: newTool, icon, msgKey, kbd }) =>
                  newTool && (
                    <DropdownItem
                      key={newTool}
                      eventKey={newTool}
                      onSelect={handleToolSelect}
                      active={toolDef?.tool === newTool}
                    >
                      <FontAwesomeIcon icon={icon} /> {m?.tools[msgKey]}{' '}
                      {kbd && (
                        <>
                          <kbd>g</kbd> <kbd>{kbd}</kbd>
                        </>
                      )}
                    </DropdownItem>
                  ),
              )}
          </ul>
        </Popover>
      </Overlay>
    </>
  );
}
