import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { DeliveryAddressFields } from '@/components/cart/DeliveryAddressFields';
import { DeliveryAddressSummary } from '@/components/cart/DeliveryAddressSummary';
import { NetworkRetryState } from '@/components/network/NetworkRetryState';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { useCartQuery } from '@/hooks/useCart';
import { usePlaceOrder } from '@/hooks/useOrders';
import { useProfile } from '@/hooks/useProfile';
import { useUserStore } from '@/store/userStore';
import type { PlaceOrderBody } from '@/services/order.service';
import { buildOrderWhatsAppMessage } from '@/utils/whatsappOrder';
import { getWhatsAppAdminPhone, openWhatsAppChat } from '@/utils/openWhatsApp';
import { formatCurrencyINR } from '@/utils/formatCurrency';
import {
  cartDisplayQty,
  formatDisplayQty,
  isPopulatedProduct,
} from '@/utils/cartLines';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import {
  getSavedDelivery,
  hasSavedDelivery,
  hydrateDeliveryForm,
  type DeliveryFormValues,
} from '@/utils/deliveryAddress';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    data: cart,
    error: cartError,
    isError: cartIsError,
    isLoading: cartIsLoading,
    isRefetching: cartIsRefetching,
    refetch: refetchCart,
  } = useCartQuery();
  const { data: profileFromApi } = useProfile();
  const storeProfile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const place = usePlaceOrder();

  const profile = profileFromApi ?? storeProfile;

  const shopAddress = profile?.address?.trim() ?? '';
  const hasShopAddress = shopAddress.length > 0;
  const [useShopAddress, setUseShopAddress] = useState(hasShopAddress);
  const [delivery, setDelivery] = useState<DeliveryFormValues>(() =>
    hydrateDeliveryForm(profile)
  );

  useEffect(() => {
    if (profileFromApi) setProfile(profileFromApi);
  }, [profileFromApi, setProfile]);

  useEffect(() => {
    if (!hasShopAddress) setUseShopAddress(false);
  }, [hasShopAddress]);

  useEffect(() => {
    if (!profile || useShopAddress) return;
    setDelivery((prev) => {
      if (prev.deliveryAddress.trim() && prev.pincode.trim()) return prev;
      return hydrateDeliveryForm(profile);
    });
  }, [profile, useShopAddress]);

  const items = cart?.items ?? [];
  const totalDisplayQty = cartDisplayQty(cart);

  useEffect(() => {
    if (cart && !items.length) {
      router.replace('/cart');
    }
  }, [cart, items.length, router]);

  const selectShopDelivery = () => {
    setUseShopAddress(true);
  };

  const selectCustomDelivery = () => {
    setUseShopAddress(false);
    setDelivery((prev) => {
      if (prev.deliveryAddress.trim() && prev.pincode.trim()) return prev;
      return hydrateDeliveryForm(profile);
    });
  };

  const orderPayload = useMemo((): PlaceOrderBody | null => {
    if (useShopAddress && hasShopAddress) {
      return { useShopAddress: true };
    }
    const addr = delivery.deliveryAddress.trim();
    const pc = delivery.pincode.trim();
    if (!addr || !pc) return null;
    return {
      useShopAddress: false,
      deliveryAddress: addr,
      pincode: pc,
      landmark: delivery.landmark.trim() || undefined,
    };
  }, [useShopAddress, hasShopAddress, delivery]);

  const canPlace = Boolean(orderPayload && items.length > 0);

  const previewDelivery = useMemo(() => {
    if (!useShopAddress && delivery.deliveryAddress.trim()) return delivery;
    if (hasSavedDelivery(profile)) return getSavedDelivery(profile);
    return delivery;
  }, [useShopAddress, delivery, profile]);

  const placeOrder = async () => {
    if (!orderPayload) {
      Toast.show({
        type: 'error',
        text1: 'Delivery address required',
        text2: hasShopAddress
          ? 'Choose shop delivery or enter street address and pincode.'
          : 'Enter street address and pincode to continue.',
      });
      return;
    }
    try {
      const order = await place.mutateAsync(orderPayload);
      const message = buildOrderWhatsAppMessage({ order, profile });
      try {
        await openWhatsAppChat(getWhatsAppAdminPhone(), message);
      } catch {
        Toast.show({
          type: 'info',
          text1: 'Order placed',
          text2: 'Could not open WhatsApp. Send the invoice manually.',
        });
      }
      Toast.show({ type: 'success', text1: 'Order placed' });
      router.replace(`/orders/${order._id}`);
    } catch (e: unknown) {
      Toast.show({
        type: 'error',
        text1: 'Could not place order',
        text2: getApiErrorMessage(e, 'Please check your internet and try again.'),
      });
    }
  };

  if (cartIsLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (cartIsError && !cart) {
    return (
      <NetworkRetryState
        error={cartError}
        loading={cartIsRefetching}
        onRetry={() => refetchCart()}
      />
    );
  }

  if (!items.length) return null;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </Pressable>
        <Text style={styles.title}>Order summary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 140 },
        ]}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {items.map((it) => {
            const p = isPopulatedProduct(it.productId) ? it.productId : null;
            if (!p) return null;
            return (
              <CartLineItem key={it._id} item={it} product={p} readonly />
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Delivery</Text>
        <View style={styles.card}>
          {hasShopAddress ? (
            <Pressable
              onPress={selectShopDelivery}
              style={[styles.choice, useShopAddress && styles.choiceActive]}>
              <View style={styles.choiceRadio}>
                {useShopAddress ? <View style={styles.choiceDot} /> : null}
              </View>
              <View style={styles.choiceBody}>
                <Text style={styles.choiceTitle}>Deliver to shop address</Text>
                {profile?.shopName ? (
                  <Text style={styles.choiceMeta}>{profile.shopName}</Text>
                ) : null}
                <Text style={styles.choiceMeta}>{shopAddress}</Text>
              </View>
            </Pressable>
          ) : null}

          <Pressable
            onPress={selectCustomDelivery}
            style={[
              styles.choice,
              !useShopAddress && styles.choiceActive,
              hasShopAddress && styles.choiceSpaced,
            ]}>
            <View style={styles.choiceRadio}>
              {!useShopAddress ? <View style={styles.choiceDot} /> : null}
            </View>
            <View style={styles.choiceBody}>
              <Text style={styles.choiceTitle}>
                {hasShopAddress
                  ? 'Different delivery address'
                  : 'Delivery address'}
              </Text>
              <DeliveryAddressSummary
                profile={profile}
                delivery={previewDelivery}
              />
            </View>
          </Pressable>

          {!useShopAddress ? (
            <View style={styles.form}>
              <DeliveryAddressFields
                profile={profile}
                values={delivery}
                onChange={(patch) =>
                  setDelivery((prev) => ({ ...prev, ...patch }))
                }
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Quantity</Text>
          <Text style={styles.footerValue}>
            {formatDisplayQty(totalDisplayQty)}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>
            {formatCurrencyINR(cart!.totalPrice)}
          </Text>
        </View>
        <Button
          title="Place order"
          loading={place.isPending}
          disabled={!canPlace}
          onPress={placeOrder}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900' },
  scroll: { padding: SPACING.md, gap: SPACING.sm },
  sectionTitle: {
    fontWeight: '900',
    fontSize: 14,
    color: colors.darkGray,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
    overflow: 'hidden',
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  choiceSpaced: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  choiceActive: { backgroundColor: colors.primaryTint },
  choiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  choiceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  choiceBody: { flex: 1, gap: 4 },
  choiceTitle: { fontWeight: '800', color: colors.darkGray },
  choiceMeta: {
    color: colors.mediumGray,
    fontSize: 13,
    lineHeight: 18,
  },
  form: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: { color: colors.mediumGray, fontWeight: '600' },
  footerValue: { fontWeight: '800', color: colors.darkGray },
  footerTotal: { fontWeight: '900', color: colors.success, fontSize: 16 },
});
