import { Dialog } from "@/components/Dialog";
import Button from "@/components/Button";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import useThemeStyles from "@/theme/hooks/useThemeStyles";
import { DialogContent, ListItemIcon, ListItemText, MenuItem, SxProps } from "@mui/material";
import { DoneIcon, SearchIcon } from "@/components/icons";
import { countryListWithFlag } from "@/mock/countryListWithFlag";
import { SearchInput } from "@/components/Form";
import { CountryPickerEmptyComponent } from "..";
import { MediaCountriesEnum } from "move-types/lib";
import DialogAction from "@/components/Dialog/DialogActions";

interface CountryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: (countrName: MediaCountriesEnum) => void;
}

export default function CountryPickerModal({ isOpen, onClose, onOk }: CountryPickerModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(MediaCountriesEnum.USA);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredCountries = useMemo(() => {
    return countryListWithFlag.filter((language) => language.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);

  const handleOnSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleOnClose = () => {
    setIsSearchInputVisible(false);
    onClose();
  };

  const handleOnConfirm = () => {
    onOk(value);
    setIsSearchInputVisible(false);
  };

  const handleOnSearchInputVisible = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const dialogBoxStyle = useThemeStyles<SxProps>((theme) => ({
    "& .MuiDialog-paper": {
      width: theme.spacing(48),
      maxHeight: theme.spacing(64),
    },
  }));

  return (
    <Dialog open={isOpen} onClose={onClose} headerText={t("Components.Modals.CountryPickerModal.pickACountry")} sx={dialogBoxStyle} hideCrossButton>
      <DialogContent>
        {isSearchInputVisible ? <SearchInput autoFocus onChange={handleOnSearchChange} placeholder={t("Components.Modals.CountryPickerModal.search")} /> : null}
        <RadioGroup value={value} onChange={handleOnChange}>
          {filteredCountries.map((country) => {
            return (
              <MenuItem onClick={() => setValue(country.name)}>
                <ListItemIcon sx={{ fontSize: "20px" }}>{country.flag}</ListItemIcon>
                <ListItemText>{country.name}</ListItemText>
                <Radio value={country.name} />
              </MenuItem>
            );
          })}
          {!filteredCountries.length ? <CountryPickerEmptyComponent height={32} /> : null}
        </RadioGroup>
      </DialogContent>
      <DialogAction>
      <SearchIcon onClick={handleOnSearchInputVisible} />
      <Button onClick={handleOnClose} variant="text">
        {t("Components.Modals.CountryPickerModal.cancel")}
      </Button>
      <Button onClick={handleOnConfirm} variant="contained" endIcon={<DoneIcon />}>
        {t("Components.Modals.CountryPickerModal.ok")}
      </Button>
    </DialogAction>
    </Dialog>
  );
}
