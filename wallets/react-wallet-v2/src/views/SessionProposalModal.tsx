import { MAINNET_CHAINS, TChain } from '@/data/EIP155Data'
import ModalStore from '@/store/ModalStore'
import { walletConnectClient } from '@/utils/WalletConnectUtil'
import { wallet } from '@/utils/WalletUtil'
import { Avatar, Button, Col, Container, Divider, Link, Modal, Row, Text } from '@nextui-org/react'
import { Fragment } from 'react'

export default function SessionProposalModal() {
  // Get proposal data and wallet address from store
  const proposal = ModalStore.state.data?.proposal

  // Ensure proposal is defined
  if (!proposal) {
    return <Text>Missing proposal data</Text>
  }

  // Get required proposal data
  const { proposer, permissions, relay } = proposal
  const { icons, name, url } = proposer.metadata
  const { chains } = permissions.blockchain
  const { methods } = permissions.jsonrpc
  const { protocol } = relay

  // Hanlde approve action
  async function onApprove() {
    if (proposal) {
      const response = {
        state: {
          accounts: chains.map(chain => `${chain}:${wallet.address}`)
        }
      }
      await walletConnectClient.approve({ proposal, response })
    }
    ModalStore.close()
  }

  // Hanlde reject action
  async function onReject() {
    if (proposal) {
      await walletConnectClient.reject({ proposal })
    }
    ModalStore.close()
  }

  return (
    <Fragment>
      <Modal.Header>
        <Text h3>Session Proposal</Text>
      </Modal.Header>

      <Modal.Body>
        <Container css={{ padding: 0 }}>
          <Row align="center">
            <Col span={3}>
              <Avatar src={icons[0]} />
            </Col>
            <Col span={14}>
              <Text h5>{name}</Text>
              <Link href={url}>{url}</Link>
            </Col>
          </Row>

          <Divider y={2} />

          <Row>
            <Col>
              <Text h5>Blockchains</Text>
              <Text color="$gray400">
                {chains.map(chain => MAINNET_CHAINS[chain as TChain]?.name ?? chain).join(', ')}
              </Text>
            </Col>
          </Row>

          <Divider y={2} />

          <Row>
            <Col>
              <Text h5>Methods</Text>
              <Text color="$gray400">{methods.map(method => method).join(', ')}</Text>
            </Col>
          </Row>

          <Divider y={2} />

          <Row>
            <Col>
              <Text h5>Relay Protocol</Text>
              <Text color="$gray400">{protocol}</Text>
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject}>
          Reject
        </Button>
        <Button auto flat color="success" onClick={onApprove}>
          Approve
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
