import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout_user } from '../Redux/Authantication/auth.action';
import { isAdmin } from '../Redux/Authantication/auth.session';
import {
  Box, Flex, Text, Button, IconButton, Stack, Collapse, Icon, Link,
  Popover, PopoverTrigger, PopoverContent, useColorModeValue,
  useDisclosure, Image, useColorMode, useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { BsGlobe2, BsBuildingFillCheck } from 'react-icons/bs';
import { IoIosNotifications } from 'react-icons/io';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { MdOutlineFlight } from 'react-icons/md';
import { AiFillCar } from 'react-icons/ai';
import { Link as RouterLink } from 'react-router-dom';

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuth, activeUser } = useSelector((store) => store.LoginReducer);
  const [signingOut, setSigningOut] = useState(false);
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const background = useColorModeValue('white', 'gray.800');
  const foreground = useColorModeValue('gray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.900');

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await dispatch(logout_user);
    } catch (error) {
      toast({ title: 'Could not finish signing out', description: error.message, status: 'error', isClosable: true });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Box bg={background} color={foreground} borderBottom="1px solid" borderColor={borderColor}>
      <Flex minH="64px" align="center" justify="space-between" px={{ base: 4, md: 8 }} py={3} gap={4} wrap="wrap">
        <Flex align="center" gap={4}>
          <RouterLink to="/">
            <Image src={colorMode === 'light' ? 'https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg' : 'https://i.postimg.cc/fRx4D7QH/logo3.png'} alt="Expedia home" w={{ base: '130px', md: '160px' }} h="44px" objectFit="contain" />
          </RouterLink>
          <Box display={{ base: 'none', lg: 'block' }}><DesktopNav /></Box>
          <IconButton aria-label="Toggle travel menu" onClick={onToggle} icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} size="sm" display={{ base: 'inline-flex', lg: 'none' }} />
        </Flex>
        <Flex align="center" justify={{ base: 'flex-start', md: 'flex-end' }} gap={{ base: 3, md: 5 }} wrap="wrap" flex={{ base: '1 1 100%', md: '0 1 auto' }} fontWeight="500" fontSize={{ base: '14px', md: '16px' }}>
          <Box display={{ base: 'none', xl: 'flex' }} alignItems="center"><Icon mr={1} as={BsGlobe2} />English</Box>
          <Box display={{ base: 'none', xl: 'block' }}>Support</Box>
          {isAuth && <Link as={RouterLink} to="/trips" whiteSpace="nowrap">Trips</Link>}
          {isAuth && isAdmin(activeUser) && <Link as={RouterLink} to="/admin" whiteSpace="nowrap">Admin</Link>}
          <Icon display={{ base: 'none', lg: 'block' }} fontSize="23px" as={IoIosNotifications} />
          {isAuth ? <>
            <Text maxW={{ base: '140px', md: '180px' }} noOfLines={1} title={activeUser.user_name}>{activeUser.user_name || 'My account'}</Text>
            <Button onClick={handleLogout} isLoading={signingOut} variant="outline" size="sm" minW="88px" whiteSpace="nowrap">Sign out</Button>
          </> : <Button as={RouterLink} to="/login" variant="ghost" size="sm" minW="88px" whiteSpace="nowrap">Sign in</Button>}
          <IconButton aria-label={colorMode === 'light' ? 'Use dark mode' : 'Use light mode'} onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} size="sm" />
        </Flex>
      </Flex>
      <Collapse in={isOpen} animateOpacity><MobileNav /></Collapse>
    </Box>
  );
}

  const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
  
    return (
      <Stack direction={'row'} spacing={4}>
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label} mt={'12px'} zIndex={5}  >
            <Popover trigger={'click'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Box fontSize={20} zIndex={10}>
                    <Link
                    p={2}
                    href={navItem.href ?? '#'}
                    fontSize={13}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                        textDecoration: 'none',
                        color: linkHoverColor,
                    }}>
                    {navItem.label}
                    </Link>
                    <Icon  pt={2} as={HiOutlineChevronDown} />
                </Box>
                
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  
                  border={0}
                  boxShadow={'xl'}
                  bg={'white'}
                  zIndex={5}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    );
  };
  
  const DesktopSubNav = ({ label, href,icon }) => {
    return (
      <Link
        href={href}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box display={'flex'} >
            <Icon as={icon} mr={2} mt={1} />
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'black' }}
              fontWeight={500}>
              {label}
            </Text>
            
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'black'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    );
  };
  
  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ lg: 'none' }}>
        {NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      </Stack>
    );
  };
  
  const MobileNavItem = ({ label, children, href }) => {
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          as={Link}
          href={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => (
                <Link key={child.label} py={2} href={child.href}>
                  {child.label}
                </Link>
              ))}
          </Stack>
        </Collapse>
      </Stack>
    );
  };
  
  
  
  const NAV_ITEMS = [
    {
      label: 'More Travels',
      children: [
        {
          label: 'Stays',
          href: '#',
          icon : BsBuildingFillCheck
        },
        
        {
          label: 'Flight',
          href: '#',
          icon : MdOutlineFlight
        },
        {
            label : 'Car',
            href : '#',
            icon : AiFillCar
        }

      ],
    }
  ];
