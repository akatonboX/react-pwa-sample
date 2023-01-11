import { Menu, MenuItem, MenuProps, MenuItemProps, RatingClassKey } from "@mui/material";
import React from "react";
import lodash, { isString } from "lodash";
import styles from "./dropdownMenu.module.scss";


/**
 * Loadingのコンポーネント
 * @param props なし
 */
export const DropdownMenu = function(
  props: {
    menuItems: React.ReactElement[],
    menuProps?: MenuProps,
    children: (openMenu: (targetElement: HTMLElement) => void, isOpen: boolean) => React.ReactElement
  }
) 
{
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const openMenu = (targetElement: HTMLElement) => {setAnchorElement(targetElement);};
  const isOpen = Boolean(anchorElement);
  const menuProps = props.menuProps != null ? props.menuProps : {};
  return (
    <>
      {props.children(openMenu, isOpen)}
      <Menu {...menuProps} anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={() => {setAnchorElement(null)}} >
        {props.menuItems.map((menuItem, index) => {
          const newProps = lodash.cloneDeep(menuItem.props);
          newProps["key"] = index;
          if (React.isValidElement(menuItem) && menuItem.type === MenuItem) {
            const defaultOnClick = (menuItem.props as MenuItemProps).onClick;
            newProps["onClick"] = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
              if(defaultOnClick != null){
                defaultOnClick(e);
              }
              setAnchorElement(null);
            };
          }
          const newElement = React.cloneElement(menuItem, newProps);
          return newElement;
        })}
      </Menu>
    </>
  );
};