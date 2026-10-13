import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import Header from "../../components/Header";
import { getTaskInterest } from "../../services/productServices";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#F3F5FA",
  surface: "#FFFFFF",
  ink: "#12203F",
  inkSoft: "#5B6785",
  inkMute: "#97A1B8",
  line: "#E6EAF3",
  primary: "#4F46E5",
  primarySoft: "#EEF0FF",
  hero: "#12203F",
  heroAccent: "#2DD4BF",
};

// One palette shared by every chart, legend and chip so a category keeps its colour everywhere.
const PALETTE = ["#4F46E5", "#14B8A6", "#F59E0B", "#EF4444", "#8B5CF6", "#0EA5E9"];

const MAX_CONTENT_WIDTH = 640; // keeps layout tidy on tablets / foldables

/* ------------------------------------------------------------------ */
/*  Helpers (logic unchanged)                                          */
/* ------------------------------------------------------------------ */
const safeNumber = (value) => (isNaN(value) || value == null ? 0 : Number(value));

const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

const titleCase = (text) =>
  text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/* ------------------------------------------------------------------ */
/*  Small UI pieces                                                    */
/* ------------------------------------------------------------------ */
const Card = ({ title, subtitle, children, s }) => (
  <View style={[styles.card, { padding: s(16), borderRadius: s(22), marginBottom: s(16) }]}>
    <Text style={[styles.cardTitle, { fontSize: s(16) }]}>{title}</Text>
    {subtitle ? (
      <Text style={[styles.cardSubtitle, { fontSize: s(12), marginBottom: s(14) }]}>
        {subtitle}
      </Text>
    ) : (
      <View style={{ height: s(12) }} />
    )}
    {children}
  </View>
);

const StatTile = ({ value, label, s, accent }) => (
  <View style={[styles.statTile, { padding: s(12), borderRadius: s(16) }]}>
    <Text style={[styles.statValue, { fontSize: s(22), color: accent ? COLORS.heroAccent : "#fff" }]}>
      {value}
    </Text>
    <Text style={[styles.statLabel, { fontSize: s(11) }]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const DonutChart = ({ data, size, total, s, totalLabel }) => (
  <View style={{ alignItems: "center" }}>
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <PieChart
        data={data}
        width={size}
        height={size}
        chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft={String(size / 4)}
        hasLegend={false}
        absolute
      />
      {/* donut hole */}
      <View
        pointerEvents="none"
        style={[
          styles.donutHole,
          {
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: size * 0.21,
          },
        ]}
      >
        <Text style={[styles.donutTotal, { fontSize: s(20) }]}>{total}</Text>
        <Text style={[styles.donutCaption, { fontSize: s(10) }]}>{totalLabel}</Text>
      </View>
    </View>
  </View>
);

const Legend = ({ data, s }) => (
  <View style={{ marginTop: s(14) }}>
    {data.map((item, i) => (
      <View
        key={`${item.label}-${i}`}
        style={[
          styles.legendRow,
          { paddingVertical: s(9) },
          i !== data.length - 1 && styles.legendDivider,
        ]}
      >
        <View style={[styles.legendDot, { backgroundColor: item.color, width: s(10), height: s(10), borderRadius: s(5) }]} />
        <Text style={[styles.legendName, { fontSize: s(13) }]} numberOfLines={1}>
          {item.label}
        </Text>
        <Text style={[styles.legendCount, { fontSize: s(13) }]}>{item.population}</Text>
        <View style={[styles.legendPill, { backgroundColor: item.color + "1F", borderRadius: s(10), paddingHorizontal: s(8), paddingVertical: s(3), minWidth: s(54) }]}>
          <Text style={[styles.legendPercent, { color: item.color, fontSize: s(11) }]}>
            {item.percent}%
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const EmptyState = ({ s, loading }) => (
  <View style={[styles.empty, { paddingVertical: s(36) }]}>
    {loading ? (
      <ActivityIndicator color={COLORS.primary} />
    ) : (
      <>
        <View style={[styles.emptyIcon, { width: s(48), height: s(48), borderRadius: s(24) }]}>
          <Text style={{ fontSize: s(22) }}>📊</Text>
        </View>
        <Text style={[styles.emptyTitle, { fontSize: s(15), marginTop: s(10) }]}>No product interest yet</Text>
        <Text style={[styles.emptyText, { fontSize: s(12) }]}>
          Charts will appear here once leads show interest in a product.
        </Text>
      </>
    )}
  </View>
);

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */
const Status = ({ navigation }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const { width: screenWidth } = useWindowDimensions();

  // Responsive helpers: scale against a 390pt design width, clamped so tiny
  // phones don't get cramped and big phones (S25 Ultra, Pro Max) / tablets don't balloon.
  const contentWidth = Math.min(screenWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(Math.max(contentWidth / 390, 0.82), 1.25);
  const s = (n) => Math.round(n * scale);

  const pagePadding = s(16);
  const cardInnerWidth = contentWidth - pagePadding * 2 - s(16) * 2;
  const donutSize = Math.min(cardInnerWidth, s(220));

  useEffect(() => {
    getTaskInterest()
      .then((res) => {
        const validLeads = res.data.filter((lead) => lead.lead_id); // Filter only leads with lead_id
        setLeads(validLeads);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const {
    categoryLabels,
    categoryValues,
    pieData,
    productPieData,
    totalCategoryCount,
    totalVariations,
    categoryColorMap,
  } = useMemo(() => {
    // Aggregate category data
    const categoryCount = leads.reduce((acc, lead) => {
      const categoryName = lead.category?.name;
      if (categoryName) {
        acc[categoryName] = safeNumber(acc[categoryName]) + 1;
      }
      return acc;
    }, {});

    // Top 5 categories
    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const categoryLabels = sortedCategories.map(([name]) =>
      name.length > 7 ? `${name.toUpperCase().slice(0, 6)}...` : name.toUpperCase()
    );
    const categoryValues = sortedCategories.map(([_, count]) => safeNumber(count));
    const totalCategoryCount = categoryValues.reduce((sum, count) => sum + count, 0);

    const categoryColorMap = {};
    sortedCategories.forEach(([name], i) => {
      categoryColorMap[name] = PALETTE[i % PALETTE.length];
    });

    const pieData = sortedCategories.map(([name, count], index) => ({
      label: titleCase(truncate(name, 22)),
      name: titleCase(truncate(name, 22)),
      population: safeNumber(count),
      percent: ((count / totalCategoryCount) * 100).toFixed(1),
      color: PALETTE[index % PALETTE.length],
      legendFontColor: COLORS.ink,
      legendFontSize: 9,
    }));

    // Aggregate data based on variation_value
    const variationCount = leads.reduce((acc, lead) => {
      const variation = lead.variation_value || "Unknown"; // Default to "Unknown" if no value
      acc[variation] = (acc[variation] || 0) + 1;
      return acc;
    }, {});

    const totalVariations = Object.values(variationCount).reduce((sum, count) => sum + count, 0);
    const productPieData = Object.entries(variationCount).map(([variation, count], index) => ({
      label: titleCase(truncate(variation, 22)),
      name: titleCase(truncate(variation, 22)),
      population: count,
      percent: ((count / totalVariations) * 100).toFixed(1),
      color: PALETTE[index % PALETTE.length],
      legendFontColor: COLORS.ink,
      legendFontSize: 9,
    }));

    return {
      categoryLabels,
      categoryValues,
      pieData,
      productPieData,
      totalCategoryCount,
      totalVariations,
      categoryColorMap,
    };
  }, [leads]);

  const onBackPressed = () => {
    navigation.pop();
  };

  const hasData = leads.length > 0 && categoryValues.length > 0;
  const topCategory = pieData[0]?.label || "—";

  const renderLead = ({ item, index }) => {
    const categoryName = item.category?.name;
    const chipColor = (categoryName && categoryColorMap[categoryName]) || COLORS.inkSoft;
    return (
      <View
        style={[
          styles.listItem,
          { paddingVertical: s(12), paddingHorizontal: s(12), borderRadius: s(16), marginBottom: s(10) },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { width: s(40), height: s(40), borderRadius: s(14), backgroundColor: chipColor + "1F" },
          ]}
        >
          <Text style={[styles.avatarText, { color: chipColor, fontSize: s(14) }]}>
            {(categoryName || "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: s(12) }}>
          <Text style={[styles.leadName, { fontSize: s(14) }]} numberOfLines={1}>
            {item.id ? `Lead ID: ${item.id}` : "No ID"}
          </Text>
          {item.variation_value ? (
            <Text style={[styles.leadMeta, { fontSize: s(11) }]} numberOfLines={1}>
              {item.variation_value}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.chip,
            { backgroundColor: chipColor + "1A", borderRadius: s(12), paddingHorizontal: s(10), paddingVertical: s(5), maxWidth: "45%" },
          ]}
        >
          <Text style={[styles.leadCategory, { color: chipColor, fontSize: s(11) }]} numberOfLines={1}>
            {categoryName || "No Category"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header
        label="Lead Product Interest"
        image=""
        onPress={onBackPressed}
        icon="arrow-left"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: s(40) + (Platform.OS === "ios" ? 10 : 0),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: contentWidth, paddingHorizontal: pagePadding, paddingTop: s(14) }}>
          {/* Summary hero */}
          <View style={[styles.hero, { borderRadius: s(26), padding: s(18), marginBottom: s(16) }]}>
            <View style={[styles.heroGlow, { width: s(180), height: s(180), borderRadius: s(90) }]} />
            <Text style={[styles.heroTitle, { fontSize: s(13) }]}>Total leads with interest</Text>
            <Text style={[styles.heroNumber, { fontSize: s(44), lineHeight: s(52) }]}>
              {leads.length}
            </Text>
            <View style={[styles.statRow, { marginTop: s(10) }]}>
              <StatTile s={s} value={pieData.length} label="Top categories" />
              <View style={{ width: s(10) }} />
              <StatTile s={s} value={productPieData.length} label="Variations" />
              <View style={{ width: s(10) }} />
              <StatTile s={s} value={truncate(topCategory, 9)} label="Most popular" accent />
            </View>
          </View>

          {!hasData ? (
            <Card s={s} title="Product interest">
              <EmptyState s={s} loading={loading} />
            </Card>
          ) : (
            <>
              {/* Bar Chart */}
              <Card
                s={s}
                title="Category-wise product interest"
                subtitle="Top 5 categories by number of leads"
              >
                <View style={{ marginLeft: -s(8) }}>
                  <BarChart
                    data={{
                      labels: categoryLabels,
                      datasets: [{ data: categoryValues }],
                    }}
                    width={cardInnerWidth + s(8)}
                    height={s(220)}
                    fromZero
                    showValuesOnTopOfBars
                    withInnerLines
                    withHorizontalLabels={false}
                    segments={4}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                      backgroundGradientFrom: COLORS.surface,
                      backgroundGradientTo: COLORS.surface,
                      fillShadowGradient: COLORS.primary,
                      fillShadowGradientOpacity: 1,
                      fillShadowGradientFrom: COLORS.primary,
                      fillShadowGradientFromOpacity: 1,
                      fillShadowGradientTo: "#8B5CF6",
                      fillShadowGradientToOpacity: 0.85,
                      decimalPlaces: 0,
                      barPercentage: 0.62,
                      propsForBackgroundLines: {
                        stroke: COLORS.line,
                        strokeDasharray: "4 6",
                      },
                      propsForLabels: { fontSize: s(9) },
                      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                      labelColor: () => COLORS.inkSoft,
                    }}
                    style={{ borderRadius: s(12) }}
                  />
                </View>
              </Card>

              {/* Category donut */}
              <Card
                s={s}
                title="Category-wise product interest"
                subtitle="Share of leads per category"
              >
                <DonutChart
                  data={pieData}
                  size={donutSize}
                  total={totalCategoryCount}
                  totalLabel="leads"
                  s={s}
                />
                <Legend data={pieData} s={s} />
              </Card>

              {/* Variation donut */}
              <Card s={s} title="Top product interest" subtitle="Share of leads per product variation">
                <DonutChart
                  data={productPieData}
                  size={donutSize}
                  total={totalVariations}
                  totalLabel="leads"
                  s={s}
                />
                <Legend data={productPieData} s={s} />
              </Card>
            </>
          )}

          {/* Lead List */}
          <View style={[styles.listHeader, { marginTop: s(4), marginBottom: s(12) }]}>
            <Text style={[styles.listTitle, { fontSize: s(18) }]}>Lead product interest data</Text>
            <View style={[styles.countBadge, { borderRadius: s(12), paddingHorizontal: s(10), paddingVertical: s(3) }]}>
              <Text style={[styles.countBadgeText, { fontSize: s(12) }]}>{leads.length}</Text>
            </View>
          </View>

          <FlatList
            data={leads}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLead}
            ListEmptyComponent={
              <Text style={[styles.leadMeta, { fontSize: s(12), textAlign: "center", paddingVertical: s(16) }]}>
                No leads to show.
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Status;

/* ------------------------------------------------------------------ */
/*  Styles (sizes that must scale are applied inline via s())          */
/* ------------------------------------------------------------------ */
const shadow = Platform.select({
  ios: {
    shadowColor: "#1B2A55",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, backgroundColor: COLORS.bg },

  /* hero */
  hero: {
    backgroundColor: COLORS.hero,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.hero,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
      },
      android: { elevation: 6 },
    }),
  },
  heroGlow: {
    position: "absolute",
    right: -40,
    top: -60,
    backgroundColor: COLORS.primary,
    opacity: 0.45,
  },
  heroTitle: { color: "#B8C2DD", fontWeight: "500" },
  heroNumber: { color: "#FFFFFF", fontWeight: "800", letterSpacing: -1 },
  statRow: { flexDirection: "row" },
  statTile: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  statValue: { fontWeight: "700" },
  statLabel: { color: "#B8C2DD", marginTop: 2 },

  /* cards */
  card: { backgroundColor: COLORS.surface, ...shadow },
  cardTitle: { color: COLORS.ink, fontWeight: "700" },
  cardSubtitle: { color: COLORS.inkMute, marginTop: 3 },

  /* donut */
  donutHole: {
    position: "absolute",
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  donutTotal: { color: COLORS.ink, fontWeight: "800" },
  donutCaption: { color: COLORS.inkMute, marginTop: -2 },

  /* legend */
  legendRow: { flexDirection: "row", alignItems: "center" },
  legendDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.line },
  legendDot: { marginRight: 10 },
  legendName: { flex: 1, color: COLORS.ink, fontWeight: "500", marginRight: 8 },
  legendCount: { color: COLORS.inkSoft, fontWeight: "600", marginRight: 10 },
  legendPill: { alignItems: "center" },
  legendPercent: { fontWeight: "700" },

  /* list */
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  listTitle: { color: COLORS.ink, fontWeight: "700", flexShrink: 1 },
  countBadge: { backgroundColor: COLORS.primarySoft },
  countBadgeText: { color: COLORS.primary, fontWeight: "700" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "800" },
  leadName: { color: COLORS.ink, fontWeight: "600" },
  leadMeta: { color: COLORS.inkMute, marginTop: 2 },
  chip: { alignSelf: "center" },
  leadCategory: { fontWeight: "600" },

  /* empty */
  empty: { alignItems: "center", justifyContent: "center" },
  emptyIcon: { backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: COLORS.ink, fontWeight: "700" },
  emptyText: { color: COLORS.inkMute, textAlign: "center", marginTop: 4, paddingHorizontal: 16 },
});