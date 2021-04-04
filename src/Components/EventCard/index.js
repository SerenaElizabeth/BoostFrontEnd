import { useState } from 'react';
import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  WrapItem,
  Heading,
  GridItem,
  Text,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { getAddress, updateUser } from '../../Libs/httpRequests';
import GenericButton from 'Components/GenericButton';
import { useUserContext } from 'Libs/userContext';
import { DateTime } from 'luxon';
import EventCardWrapper from './wrapper';

function EventCard({
  name,
  time: dateTime,
  longitude,
  latitude,
  description,
  exerciseType,
  intensity,
  willAttend,
  id,
}) {
  const date = DateTime.fromISO(dateTime).toHTTP().slice(0, 17);
  const time = DateTime.fromISO(dateTime)
    .toLocaleString(DateTime.DATETIME_MED)
    .slice(13);
  const shortDate = date.slice(5, -6);

  const { dbUser, setDbUser } = useUserContext();

  const [toUpdateUser, setToUpdateUser] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(dbUser);

  const [address, setAddress] = useState({
    road: null,
    city: null,
    postcode: null,
  });

  function attendEvent() {
    setUserToUpdate({ ...dbUser, eventsIds: [...dbUser?.eventsIds, id] });
    setToUpdateUser(true);
  }

  useEffect(() => {
    if (toUpdateUser) {
      updateUser(
        process.env.REACT_APP_BACKEND_URL,
        dbUser?.id,
        userToUpdate,
        setDbUser
      );
    }
    // eslint-disable-next-line
  }, [toUpdateUser]);

  useEffect(() => {
    getAddress(
      process.env.REACT_APP_NOMINATIM_URL,
      latitude,
      longitude,
      setAddress
    );
    // eslint-disable-next-line
  }, []);

  return (
    <EventCardWrapper shortDate={shortDate} willAttend={willAttend}>
      <GridItem w="100%">
        <Accordion allowToggle minW="100%">
          <AccordionItem textAlign="center">
            <AccordionButton>
              <Box flex="1">
                <Heading size="md" textAlign="center">
                  {name}
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel textAlign="left" pb={4}>
              <HStack>
                <Heading size="xs" color="blue.300">
                  DATE
                </Heading>
                <Text>{date}</Text>
                <Heading size="xs" color="blue.300">
                  AT
                </Heading>
                <Text>{time}</Text>
              </HStack>

              <Text my={5}>{description}</Text>
              <WrapItem>
                <Text fontWeight={500} fontSize="md" color="gray.400">
                  <span className="material-icons">moving</span>{' '}
                  {intensity.toUpperCase()}
                </Text>
              </WrapItem>
              <WrapItem>
                <Text fontWeight={500} fontSize="md" color="gray.400">
                  <span className="material-icons">fitness_center</span>
                  {' ' + exerciseType.toUpperCase()}
                </Text>
              </WrapItem>

              <Text fontWeight={500} fontSize="md" color="gray.400">
                <span className="material-icons">place</span> {address.road},{' '}
                {address.city}, {address.postcode}
              </Text>
              <Box textAlign="right">
                <GenericButton
                  text="Attend"
                  handleClick={attendEvent}
                  display={willAttend ? 'none' : null}
                />
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </GridItem>
    </EventCardWrapper>
  );
}
export default EventCard;
