import {
  Page,
  Layout,
  Card,
  Thumbnail,
  Link,
  Stack,
  Heading,
  Button,
  IndexTable,
  TextStyle,
  EmptyState,
  TextContainer,
  Pagination,
  Spinner,
  TextField,
  Select,
  PageActions,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { ToastComponent } from "./Tost";
// import { BannerComponent } from "./Banner";
import { useAuthenticatedFetch } from "../hooks";

export function UpsellProductSection() {
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [ResourcePickerState, setResourceState] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [upsellProductsInfo, setUpsellProductsInfo] = useState([]);
  const [allUpsellProductsInfo, setAllUpsellProductsInfo] = useState([]);
  const [active, setActive] = useState(false);
  const [content, setContent] = useState("");
  const [isError, setIsError] = useState(false);

  //Callback
    const toggleActive = useCallback(() => setActive((active) => !active), []);


    const handleUpsellProductsQuantityChange = (arrayIndex) => (ele) => {
        console.log(ele, "handleUpsellProductsQuantityChange");
        upsellProductsInfo[arrayIndex].upsellQuantity = ele;

        setUpsellProductsInfo([...upsellProductsInfo]);

    }
  
  const handleUpsellPriorityChange = (arrayIndex) => (ele) => {
    console.log(ele, "handleUpsellPriorityChange");
    upsellProductsInfo[arrayIndex].upsellPriority = ele;

    setUpsellProductsInfo([...upsellProductsInfo]);
  };
  
  
  //useCallback((value) => setSortValue(value), []);
    // console.log(upsellProductsInfo,"After Handle");


  let ren = (
    <ToastComponent
      toggleActive={toggleActive}
      active={active}
      content={content}
      error={isError}
    />
  );

  const empty = (
    <Card>
      <EmptyState heading="">
        <p>
         Select multiple products and specify their quantity and priorities.
          {/* <Link url="https://help.shopify.com/manual" external> */}
          {/* Watch a video (2 min) */}
          {/* </Link> */}
        </p>
      </EmptyState>
    </Card>
  );
  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  useEffect(() => {
    // setIsLoading(true);
    getUpsellProducts();
  }, []);

  async function getUpsellProducts() {
    try {
      await fetch("/api/dashboard/getUpsellProducts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getProducts ======>");
        //   setIsLoading(true);
            if (data.Response.data) {
              setSelectedProducts(data.Response.data.upsellProducts);
              setUpsellProductsInfo(data.Response.data.upsellProductsInfo);
              setAllUpsellProductsInfo(data.Response.data);
              setContent("Get All Upsell Products");
              setIsError(false);
              setActive(true);
            } else {
              setContent("Select Upsell Products");
              setIsError(false);
              setActive(true);
            }
            setIsLoading(false);

          console.log("getProducts get Upsell *******************");
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function postUpsellProducts(ele) {
    let obj1 = {
      upsellProducts: ele,
      upsellProductsInfo: upsellProductsInfo,
    };

    console.log(obj1, "postUpsellProducts");
    try {
      await fetch("/api/dashboard/selectUpSellProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },

        body: JSON.stringify(obj1),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.Response, "******************");
          setSelectedProducts(data.Response.data.upsellProducts);
          setUpsellProductsInfo(data.Response.arr);
          setAllUpsellProductsInfo(data.Response.data);
          setIsLoading(false);
          setContent("Upsell Products Updated");
          setIsError(false);
          setActive(true);
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

    const sortOptions = [
      { value: "High", label: "High" },
      { value: "Medium", label: "Medium" },
      { value: "Low", label: "Low" },
    ];

  const rowMarkup = upsellProductsInfo.map((productele, index) => {
    return (
      <IndexTable.Row id={productele.id} key={productele.id} position={index}>
        <IndexTable.Cell>
          <Stack alignment="center">
            <Thumbnail
              source={productele.img ? productele.img : ImageMajor}
              alt="Black orange scarf"
              size="large"
            />
            <TextStyle>
              {productele.productName} <br /> {productele.selectedVariants}
            </TextStyle>
          </Stack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={productele.upsellQuantity}
            onChange={handleUpsellProductsQuantityChange(index)}
          />
        </IndexTable.Cell>
        {/* <IndexTable.Cell>{productele.invantryQuantity}</IndexTable.Cell> */}
        <IndexTable.Cell>
          <Select
            labelInline
            label="Priority"
            options={sortOptions}
            value={productele.upsellPriority}
            onChange={handleUpsellPriorityChange(index)}
          />
        </IndexTable.Cell>
     
      </IndexTable.Row>
    );
  });

  return (
    <>
      <Card>
        <Stack distribution="fillEvenly">
          <div></div>
          <div style={{ padding: "8% 10%" }}>
            <TextContainer>
              <Heading id="storeDetails">Upsell Orders</Heading>
              <p>
                <TextStyle variation="subdued">
                  {allUpsellProductsInfo.totalOrders ?? 0}
                </TextStyle>
              </p>
            </TextContainer>
          </div>

          <div style={{ padding: "8% 10%" }}>
            <TextContainer>
              <Heading id="storeDetails">Revenue</Heading>
              <p>
                <TextStyle variation="subdued">
                  {allUpsellProductsInfo.totalPevenue ?? 0}
                </TextStyle>
              </p>
            </TextContainer>
          </div>

          {/* <div style={{ padding: "10% 10%" }}>
            <TextContainer>
              <Heading id="storeDetails">Select Product For Upsell</Heading>
              <p>
                <TextStyle variation="subdued">
                  Select multiple products and s
                </TextStyle>
              </p>
            </TextContainer>
          </div> */}
          <div></div>
        </Stack>
      </Card>

      <Page
        title="Products"
        primaryAction={
          <>
            <Button
              primary
              onClick={() => {
                setResourceState(true);
              }}
            >
              Select Products
            </Button>
          </>
        }
      >
        <ResourcePicker
          resourceType="Product"
          showVariants={true}
          open={ResourcePickerState}
          initialSelectionIds={selectedProducts}
          selectMultiple={3}
          onCancel={() => {
            setResourceState(false);
          }}
          onSelection={(ele) => {
            setResourceState(false);
            setIsLoading(true);
            //   let arr = [];
            let allProducts = ele.selection;
            allProducts.map((ele) => {
              Object.assign(ele, {
                upsellQuantity: 1,
                upsellPriority: "High",
              });
              // let obj = {
              //   img: product.image.src,
              //   productName: product.title,
              //   selectedVariants: `${ele.variants.length} of ${product.variants.length}`,
              // };
              // arr.push(obj);
            });
            console.log("====>", allProducts);
            postUpsellProducts(allProducts);
            setSelectedProducts(allProducts);
          }}
        />

        <Layout fullWidth>
          <Layout.Section oneThird>
            <div style={{ marginTop: "var(--p-space-5)" }}>
              <TextContainer>
                <Heading id="storeDetails">Select Product For Upsell</Heading>
                <p>
                  <TextStyle variation="subdued">
                    Select multiple products and specify their quantity and
                    priorities.
                  </TextStyle>
                </p>
              </TextContainer>
            </div>
          </Layout.Section>
          <Layout.Section>
            <Card>
              {isLoading ? (
                <div style={{ padding: "10% 50%" }}>
                  <Spinner accessibilityLabel="Spinner example" size="large" />
                </div>
              ) : // {
              selectedProducts.length == 0 ? (
                empty
              ) : (
                <Card>
                  <Card>
                    <Card.Section>
                      <IndexTable
                        resourceName={resourceName}
                        itemCount={selectedProducts.length}
                        loading={isLoading}
                        headings={[
                          { title: "Product" },
                          { title: "Quantity" },
                          { title: "Priority" },
                        ]}
                        selectable={false}
                      >
                        {rowMarkup}
                        {console.log("log-6", rowMarkup)}
                      </IndexTable>
                    </Card.Section>

                    <p
                      style={{
                        textAlign: "center",
                        width: "100%",
                        padding: "2%",
                      }}
                    >{`Showing ${selectedProducts.length} of ${selectedProducts.length} results`}</p>
                  </Card>
                  {/* <div className="pages">
                  <Pagination
                    hasPrevious
                    onPrevious={() => {
                      console.log("Previous");
                    }}
                    hasNext
                    onNext={() => {
                      console.log("Next");
                    }}
                  />
                </div> */}
                </Card>
              )}
              {/* } */}
            </Card>
          </Layout.Section>
        </Layout>
        <PageActions
          primaryAction={{
            content: "Save",
            onAction: () => {
              postUpsellProducts(selectedProducts);
            },
          }}
          // secondaryActions={[
          //   {
          //     content: "Delete",
          //     destructive: true,
          //   },
          // ]}
        />
        {active ? ren : null}
      </Page>
    </>
  );
}
